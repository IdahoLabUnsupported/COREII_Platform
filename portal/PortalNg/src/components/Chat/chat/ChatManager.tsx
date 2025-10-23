// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState, useEffect, useRef } from 'react'
import Ping from '../Ping'
import InputField from './InputField'
import ChatHistory from './ChatHistory'
import ChatStyleToggles from './ChatStyleToggles'
import type { Message, KGObject } from '../shared/interfaces'
import { MAX_CHAT_LENGTH } from '../shared/constants'
import {
    determineChatAction,
    performRagRetrieval,
    streamRAGResponse,
    formatRAGContext,
    getChatSize,
    createDataOverview,
} from './chat_utils'

export default function ChatManager({
    onUpdateActiveObject,
    messages,
    updateMessages,
    showChatOptions,
    updateShowChatOptions,
} : {
    onUpdateActiveObject: (newValue: KGObject | null) => void,
    messages: Message[]
    updateMessages: (updatedMessages: Message[]) => void,
    showChatOptions: boolean,
    updateShowChatOptions: (newValue: boolean) => void,
}) {

    let dataset: string | null = null;
    const dataOverview = useRef<string | null>(null);
    const [chatStatus, setChatStatus] = useState<string | null>(null)

    // Settings value can be 0, 0.5, or 1
    const [temperature, setTemperature] = useState(0.5);
    const [diversity, setDiversity] = useState(0.5);
    
    // get an overview of the available data
    useEffect(() => {
        const getDataOverview = async () => {
            dataOverview.current = await createDataOverview();
        }
        getDataOverview();
    }, [])

    const handleSubmitMessage = async (_inputText: string) => {
        // This method runs each time the user submits a new message to the chat.
        setChatStatus("analyzing")
        updateShowChatOptions(false)

        // Check if the chat size has made the context window dangerously large
        if (getChatSize([...messages, {role: "user", content: _inputText}]) >= MAX_CHAT_LENGTH) {
            alert("Chat history is too large, please reset the chat or refresh the page.")
            setChatStatus(null)
            return;
        }
    
        // Add the user's message to the messages array
        let _messages = [...messages, {role: "user", content: _inputText}]
        updateMessages(_messages)
    
        const messageStartTime = Date.now();

        // Perform analysis of the user's question so we know whether 
        // to immediately respond to the user, or to perform RAG
        // and retrieve more information before responding.
        const chatAction = await determineChatAction(_messages, dataOverview.current)
        const determineChatActionTime = (Date.now() - messageStartTime) / 1000;

        console.log(`CHAT ACTION: ${JSON.stringify(chatAction)}`)
        console.log(`TEMPERATURE: ${temperature}, DIVERSITY: ${diversity}`)

        if (chatAction?.action === "respond") {
            // The LLM has all the information it needs,
            // so we can respond to the user immediately
            const newMessage = {
                role: "assistant",
                content: chatAction?.response || "Could you please give me a bit more detail?",
                action: chatAction,
            }
            _messages = [..._messages, newMessage]
            updateMessages(_messages)

        } else if (chatAction?.topic || chatAction?.report) {
            // The LLM is requesting to look up more information.
            // In this case, we need to perform RAG.
            // First, perform semantic search for retrieval of relevant information
            setChatStatus('retrieving')
            const retrievedData = await performRagRetrieval(
                chatAction.topic,
                chatAction.dataset,
                chatAction.report,
                chatAction.earliest_year,
                diversity,
                40,
            )

            // Use retrieved data to create context for a RAG prompt
            const [context, contextualizedIds] = formatRAGContext(retrievedData)
            retrievedData.context = context;
            retrievedData.contextualizedIds = contextualizedIds;

            console.log("RETRIEVED RAG DATA: ", retrievedData)
            console.log(JSON.stringify({
                "Determine chat action time": determineChatActionTime,
                "RAG retrieval time": (Date.now() - messageStartTime)/1000,
            }))

            const newMessage = {
                role: "assistant",
                content: "",
                action: chatAction,
                data: retrievedData,
            }
            _messages = [..._messages, newMessage]
            updateMessages(_messages)

            // Stream a response back to the user
            setChatStatus('generating')
            await streamRAGResponse(
                _messages,
                updateMessages,
                temperature,
                context,
            );

        } else {
            // If we didn't get a valid assessment about what action to take,
            // then use the existing messages to stream an llm response back to the user
            setChatStatus("generating")
            const newMessage = { role: "assistant", content: "", action: chatAction}
            _messages = [..._messages, newMessage]
            updateMessages(_messages)
            await streamRAGResponse(
                _messages,
                updateMessages,
                temperature,
                null,
            );
        }
        setChatStatus(null)
    };

    return (
        <div>
            {messages.length > 0 && (
                <ChatHistory
                    messages={messages}
                    onUpdateActiveObject={onUpdateActiveObject}
                />
            )}
            <div>
                {chatStatus == null ? (

                    <div>
                        <InputField
                            onHandleSubmitMessage={handleSubmitMessage}
                            preventSubmit={!dataOverview.current}
                        />

                        <div className="flex flex-wrap md:justify-between px-2">
                            <div>
                                <button
                                    className="link text-xs text-left"
                                    onClick={() => updateShowChatOptions(!showChatOptions)}
                                >
                                    {showChatOptions ? "Hide" : "Show"} chat options
                                </button>
                            </div>
                            <div>
                                {messages.length > 0 && (
                                    <div>

                                        <p className="md:text-right text-xs text-muted pt-1">
                                            Chat size: {getChatSize(messages)} / {MAX_CHAT_LENGTH} characters
                                        </p>

                                        <button
                                            className="ml-auto link block text-xs"
                                            onClick={() => {updateMessages([])}}
                                        >
                                            Reset chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>


                        {showChatOptions && (
                            <div className="mt-4">
                                <ChatStyleToggles
                                    temperature={temperature}
                                    diversity={diversity}
                                    updateTemperature={setTemperature}
                                    updateDiversity={setDiversity}
                                    updateShowChatOptions={updateShowChatOptions}
                                />
                            </div>
                        )}


                    </div>

                ) : (
                    <div className="pl-2">
                        <Ping />
                    </div>
                )}
            </div>
            {/* to see the full raw message history
            <div className="mt-6">
                <pre className="text-xs">{JSON.stringify(messages, null, 2)}</pre>
            </div>
            */}
        </div>
    )
}