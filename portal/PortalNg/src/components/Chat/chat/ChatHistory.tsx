// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react'
import NetworkGraph from '../visualizations/NetworkGraph'
import ArticleCard from './CardOSTIArticle'
import {Message, KGObject, GraphData, OSTIArticle} from '../shared/interfaces'
import {
    formatSearchResultsAsHierarchy,
    buildGraphDataFromExcerpts,
    getExcerptPreviewText,
    retrieveOSTIArticles, removeDuplicateIds
} from '../shared/utils'
import { getChatbotActionString } from './chat_utils'
import {InlineXML} from "./parsers";



export default function ChatHistory({
    messages,
    onUpdateActiveObject,
}: {
    messages: Message[],
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {

    return (
        <div className="space-y-8 mb-8">
            {messages.map((m, mIndex) => (
                <div key={mIndex}>
                    {m.role === 'user' ? (
                        <UserMessage message={m} />
                    ) : (
                        <AssistantMessage
                            message={m}
                            onUpdateActiveObject={onUpdateActiveObject}
                        />
                    )}
                </div>
            ))}                
        </div>
    )
}



function UserMessage({ message }: { message: Message }) {
    return (
        <div className="inline-block max-w-md bg-slate-400 dark:bg-[#00527c] p-4 rounded-t-3xl rounded-r-3xl">
            <p>{message.content}</p>
        </div>
    )
}


function AssistantMessage({
    message,
    onUpdateActiveObject,
}: {
    message: Message,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {

    const [showSources, setShowSources] = useState<boolean>(false)
    const actionString = getChatbotActionString(message)

    return (
        <div>
            {message?.action && message?.data && (
                <>
                    <p className="text-muted mb-0 text-sm font-bold">
                        {actionString}
                        {message?.data?.ragElapsedSeconds && (
                            <span className="font-normal ml-2">({message.data.ragElapsedSeconds} seconds)</span>
                        )}
                    </p>

                    {showSources ? (
                        <div className="my-2">
                            <div className="border-t border-x border-primary rounded-t-2xl px-3 pt-2">
                                <div className="flex justify-between">
                                    <p className="text-muted font-bold pt-1">Search Results</p>
                                    <button
                                        onClick={() => {
                                            setShowSources(false)
                                        }}
                                        className="link text-xl px-2 py-1"
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            </div>
                            <div className="border-x border-b border-primary rounded-b-2xl px-3 pb-4">
                                {isSourceOSTI(message) ? (
                                    <OSTIArticleDisplay
                                        message={message}
                                        onUpdateActiveObject={onUpdateActiveObject}
                                    />
                                ) : (
                                    <RelevantInformationDisplay
                                        message={message}
                                        onUpdateActiveObject={onUpdateActiveObject}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => {
                            setShowSources(true)
                        }} className="link text-sm font-bold">
                            Show search results
                        </button>
                    )}

                </>
            )}
            <div className="llm-response mt-2">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}  // This allows HTML tags like <br> in Markdown
                >
                  {message.content}
                </Markdown>
            </div>
        </div>
    )
}

function isSourceOSTI(message: Message) : boolean  {

    let reports: KGObject[] = removeDuplicateIds([
        ...message?.data?.reports || [],
        ...(message?.data?.excerpts || []).map(x => x.report as KGObject)
    ]);

    let report: KGObject = reports[0];

    return report.source === "OSTI";

}

function OSTIArticleDisplay({
    message,
    onUpdateActiveObject,
} : {
    message: Message,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {

    const articles: OSTIArticle[] = retrieveOSTIArticles(message)
    console.log('Articles:', articles); // Add this to debug
    console.log('Articles length:', articles?.length);
    const [selectedArticle, setSelectedArticle] = useState<OSTIArticle | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleArticleClick = (article: OSTIArticle) => {
        setSelectedArticle(article);
        setShowPopup(true);

        // Wrap the OSTIArticle in a KGObject
        const kgObject: KGObject = {

            objectType: 'source',  // or whatever the appropriate type is
            oarticle: article,  // assuming this is the property name in KGObject
            id: "osti",
            // Add any other required KGObject properties
        };

        onUpdateActiveObject(kgObject);
    };

    return (
        <div>
            {(message?.data?.excerpts?.length > 0 || message?.data?.reports?.length > 0) && (
                <div>
                    <p className="text-xs text-muted">
                        OSTI articles that were used to generate the chatbot response.
                    </p>

                    <div className="mt-4 space-y-4">
                        {articles.map((article: OSTIArticle) => (
                            <div key={article?.osti_id}>
                                <div>
                                    <button
                                        className="link font-bold text-lg text-left"
                                        onClick={() => handleArticleClick(article)}
                                    >
                                        <InlineXML content={article?.title || "unknown source"} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Popup */}
            {showPopup && selectedArticle && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className="max-w-3xl max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ArticleCard
                            article={selectedArticle}  // Pass the unwrapped OSTIArticle
                            showAbstract={true}
                            onClose={() => setShowPopup(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function RelevantInformationDisplay({
                                        message,
                                        onUpdateActiveObject,
                                    }: {
    message: Message,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {

    const hierarchy: KGObject[] = formatSearchResultsAsHierarchy(message)
    const [graphData, setGraphData] = useState<GraphData | null>(null);

    useEffect(() => {
        if (message?.data?.excerpts) {
            const _graphData: GraphData = buildGraphDataFromExcerpts(message.data.excerpts, message?.data?.query)
            setGraphData(_graphData);
        }
    }, [message?.data?.excerpts])

    return (
        <div>
            {(message?.data?.excerpts?.length > 0 || message?.data?.reports?.length > 0) && (
                <div>

                    <p className="text-xs text-muted">
                        Starred items (&#9733;) were used to generate the chatbot response.
                    </p> 

                    <div className="mt-4 space-y-4">

                        {hierarchy.map((source: KGObject) => (
                            <div key={source.id}>
                                <div>
                                    <button
                                        className="link font-bold text-lg text-left"
                                        onClick={() => {
                                            onUpdateActiveObject({
                                                objectType: 'source',
                                                id: (source as KGObject).id
                                            })
                                        }}
                                    >
                                        {(source as KGObject)?.title || "unknown source"}
                                    </button>                                
                                </div>
                                <ul className="list-disc pl-4 text-muted">
                                    {source.reports?.map((report: KGObject) => (
                                        <li key={report.id}>
                                            <button
                                                className="block link text-sm font-semibold text-left"
                                                onClick={() => {
                                                    onUpdateActiveObject({
                                                        objectType: 'report',
                                                        id: (report as KGObject).id
                                                    })
                                                }}
                                            >
                                                {(report as KGObject)?.title || "unknown report"}
                                                {message?.data?.contextualizedIds?.includes(report.id) && (
                                                    <span className="ml-1">&#9733;</span>
                                                )}
                                            </button>
                                            <ul className="list-disc pl-8 text-muted">
                                                {report.excerpts?.map((excerpt: KGObject) => (
                                                    <li key={excerpt.id}>
                                                        <button
                                                            className="block link text-xs text-left"
                                                            onClick={() => {
                                                                onUpdateActiveObject({
                                                                    objectType: 'excerpt',
                                                                    id: (excerpt as KGObject).id
                                                                })
                                                            }}
                                                        >
                                                            <span>
                                                                {getExcerptPreviewText(excerpt)}
                                                            </span>
                                                            {message?.data?.contextualizedIds?.includes(excerpt.id) && (
                                                                <span className="ml-1">&#9733;</span>
                                                            )}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {graphData?.nodes && graphData?.nodes?.length > 0 && (
                        <div className="mt-2">
                            <NetworkGraph
                                graphData={graphData}
                                onUpdateActiveObject={onUpdateActiveObject}
                                width={400}
                                height={400}
                            />
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}