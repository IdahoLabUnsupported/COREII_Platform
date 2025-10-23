// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { BACKEND_RESOURCES } from '../shared/constants';
import type { Message, RetrievedData } from '../shared/interfaces'


// Format the messages to be compatible with what the LLM expects
export const formatMessagesForLLM = (_messages: Message[]) => {
    return _messages.filter(m => m.content?.length).map((m) => ({
        role: m.role,
        content: [{text: m.content}]
    }))
}


// Use the LLM to determine whether to respond to the user immediately or perform RAG
export const determineChatAction = async (_messages: Message[], dataOverview: string) => {

    const messages = formatMessagesForLLM(_messages);

    try {
        const response = await fetch(BACKEND_RESOURCES.ml.url + 'determine-chat-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                dataOverview,
            }),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null
    }
};



// Perform retrieval for RAG when the LLM decides that it needs more information to answer the question
export const performRagRetrieval = async (
    query: string,
    dataset: string | null,
    report: string | null,
    earliest_year: string | number | null,
    diversity: number = 0.5,
    maxCount: number = 15
) => {
    try {
        if (!dataset) {
            dataset = ""
        }
        if (!report) {
            report = ""
        }
        if (!earliest_year) {
            earliest_year = ""
        }
        if (query && typeof query === 'string') {
            query = query.toLowerCase().trim()
        }
        const params = `?q=${query}&dataset=${dataset}&report=${report}&maxcount=${maxCount}&earliest_year=${earliest_year}&diversity=${diversity}`
        const response = await fetch(BACKEND_RESOURCES.kg.url + `rag-retrieval` + params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Stream the response back from the RAG engine.
// This requires the list of messages with retireved data,
// plus the message setter function.
export const streamRAGResponse = async (
    clientMessages: Message[],
    updateMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    temperature: number = 0.5,
    context: string | null = null,    
    STREAM_STOP_TOKENS: string[] = ["</END>", "</STREAM>", "</s>"],
) => {

    // Here we differentiate between two arrays of messages:
    // the messages array that is managed by the frontend client, 
    // and the messages array that is sent to the LLM.
    // The messages arraay sent to the LLM must have a specific format
    // and contain no additional metadata. So we store most conversational
    // metadata in teh client messages, and only feed the LLM a smiplified
    // version of the messages.
    const messages = formatMessagesForLLM(clientMessages)

    // Add the RAG context to the last user message sent to the LLM.
    // Only the LLM will see the context added to the user message.
    // It will not be added to the client messages, so it will not show
    // up in the chat message body.
    if (context) {
        const originalMessage = messages[messages.length - 1].content[0].text;
        const messageWithContext = `Here is my message: <message>${originalMessage}</message>. Here is information from the knowlege graph that might help you answer my message: <INFORMATION>${context}</INFORMATION>. If the information does not help you answer my message, explain that there is nothing in the knowledge graph that helps to answer the message, and ask me a follow up question. If the information does help you answer my message, give your best detailed response to my message and back up your response with specific facts and findings from the knowledge graph information. If I asked you to calculate a number or make an estimate of some type of quantity, use the information provided and make your best estimate, while showing your work and acknowledging any data or assumptions you used.
        When referencing a piece of content, whenever possible, reference the English title or name (e.g., "Cyber threats in operational technology") rather than the numerical code (e.g., 124323). For example, instead of saying "MetaPhortress (1828196)" or "Report 1828196 (Metaphortress), just say "MetaPhortress". Be very detailed and informative and ask follow-up questions if you need to get more information.`
        messages[messages.length - 1].content[0].text = messageWithContext;
    };
    
    const startTime = Date.now()
    let isWaitingForFirstToken = true;

    const response = await fetch(BACKEND_RESOURCES.ml.url + 'stream-llm-response', {
        method: 'POST',
        cache: 'no-cache',
        keepalive: false,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, temperature }),
    });

    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    let streamActive = true;
    let generatedText = "";

    while (streamActive) {
        if (reader == null) {
            break;
        }
        const { value } = await reader.read();
        let token = decoder.decode(value);
        if ( STREAM_STOP_TOKENS.some(t => token.includes(t))) {
            streamActive = false;
            for (const _stopToken of STREAM_STOP_TOKENS) {
                token = token.replace(_stopToken, '');
            }
        }
        generatedText += token;
        if (isWaitingForFirstToken) {
            console.log(`Time to first token: ${(Date.now() - startTime) / 1000}`)
            isWaitingForFirstToken = false;
        }

        updateMessages((prevMessages) => 
            prevMessages.map((_message, index) => {
                if (index === clientMessages.length - 1) {
                    return { ..._message, content: generatedText }
                }
                return _message
            })
        )
    }
};


// Check if the chat history has become too large to safely add more content inside the LLM context window
export const getChatSize = (messages: Message[]) => {
    return messages.reduce((sum, message) => {
        return sum + message.content.length;
    }, 0);
}


// Take the retrieved database information and format it so it can be used for response generation in RAG
export const formatRAGContext = (
    retrievedData: RetrievedData,
    maxReports: number = 15,
    maxReportsWithContent = 10,
    maxExcerptsPerReport: number = 6,
    maxCharacters: number = 60000,
): [string | null, string[]] => {

    if (retrievedData) {
        // TODO: make this robust to different types of retrieved objects,
        // beyond excerpts and reports.

        let context = ""
        let contextualizedIds: string[] = []


        // if this is a single matching report, try to add as many of its exceprts as possible
        // until the context amount hits the maxCharacters limit
        if (retrievedData.reports.length === 1) {
            maxExcerptsPerReport = 50;
        }

        // process reports
        let nReportsWithContent = 0
        for (const _report of retrievedData.reports.slice(0, maxReports)) {
            contextualizedIds.push(_report.id)
            context += `<REPORT> ${_report.identifier} <TITLE>${_report.title}</TITLE> `
            context += `<DESCRIPTION>${_report.description}<DESCRIPTION> `
            if (_report.report_metadata) {
                context += `<METADATA>${JSON.stringify(_report.report_metadata)}</METADATA> `
            }

            // Only show content in s subset of reports
            if (nReportsWithContent < maxReportsWithContent && context.length <= maxCharacters) {
                context += "<REPORT_CONTENT>"
                // iterate over all the report excerpts and add them to the report context
                let reportLength = 0
                let excerptsPerReport = 0
                for (let i = 0; i < _report.n_excerpts; i++) {
                    if (excerptsPerReport >= maxExcerptsPerReport) break;
                    const _excerpt = retrievedData.excerpts.find(e => e.report_id === _report.id && e.excerpt_index === i)
                    if (_excerpt) {
                        let _reportContext = _excerpt.content_type === 'text'? _excerpt.text_content : _excerpt.json_content;
                        contextualizedIds.push(_excerpt.id)
                        context += JSON.stringify(_reportContext);
                        reportLength += _reportContext.length;
                        excerptsPerReport += 1;
                    }
                }
                context += "</REPORT_CONTENT>"
                nReportsWithContent += 1
            }

            context += " </REPORT>"
        }
        return [context, contextualizedIds];
    } else {
        return [null, []]
    }
}

// create a data overview to orient the chatbot and give it context about its available data
export const createDataOverview = async () => {
    // get data overview from the database
    const response = await fetch(BACKEND_RESOURCES.kg.url + 'data-overview');
    const dataOverview = await response.json();
    // formulate system message
    return JSON.stringify(dataOverview)
}

// get a string that explains the action taken by the chatbot 
export const getChatbotActionString = (message: Message) => {
    if (message?.action?.dataset && message?.action?.report && message?.data?.reports?.length === 1) {
        return `Searched for "${message.action.dataset}" report called "${message.action.report}"`
    }
    if (message?.action?.topic) {
        let actionString = `Searched for "${message.action.topic}"`
        if (message?.action?.dataset) {
            actionString += ` in ${message.action.dataset}`
        }
        if (message?.action?.earliest_year) {
            actionString += ` published in ${message.action.earliest_year} or later`
        }
        return actionString;
    }
    return null
}
