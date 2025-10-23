// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useRef, useState, useEffect, useCallback } from 'react';
import { FaBars, FaChevronRight, FaGripLinesVertical } from "react-icons/fa";
import { ThemeContextBlock } from "../../contexts/ThemeContextBlock";
import React from "react";

import ChatManager from './chat/ChatManager';
import KGBrowser from './kg-browser/KGBrowser'
import { KGObject, Message } from './shared/interfaces';
import { BACKEND_RESOURCES } from './shared/constants';
import { getObjectChildren } from './shared/utils';

interface ChatComponentProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    inputValue?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen, inputValue }) => {

    const [localIsOpen, setLocalIsOpen] = useState(false);
    const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;
    const { isChatOpen, setIsChatOpen, setIsDrawerCollapsed, isDrawerCollapsed} = React.useContext(ThemeContextBlock);

    // adjustable section controls
    const [leftWidth, setLeftWidth] = useState(40);
    const [isDragging, setIsDragging] = useState(false);

    // knowledge graph browser
    const previousActiveObjectId = useRef<string | null>(null);
    const [activeObject, setActiveObject] = useState<KGObject | null>(null)
    const [paginationPage, setPaginationPage] = useState<number>(0)
    const [messages, setMessages] = useState<Message[]>([])
    const [showChatOptions, setShowChatOptions] = useState<boolean>(false)

    // scrollable chat element
    const chatScrollDivRef = useRef<HTMLDivElement>(null);

    // Close the chat component window
    const handleCLose = () => {
        setIsOpen(false);
    };

    // scroll to the bottom of the chat div
    const scrollToBottom = () => {
        if (chatScrollDivRef.current) {
            chatScrollDivRef.current.scrollTo({
                top: chatScrollDivRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // drag the section divider
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget as HTMLElement;
        if (isDragging && container) {
            const containerRect = container.getBoundingClientRect();
            const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            const clampedWidth = Math.max(15, Math.min(75, newWidth));
            setLeftWidth(clampedWidth);
        }
    }, [isDragging]);

    // stop dragging the section divider
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);
    // start dragging the section divider
    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    // reset the data browser when the chat history is reset
    useEffect(() => {
        if (messages.length === 0) {
            // if chat was reset
            setActiveObject(null)
            setShowChatOptions(false)
        }
        // scroll to bottom of chat window when response starts
        if (messages?.length && messages[messages.length - 1].content.length < 750) {
            scrollToBottom();
        }
    }, [messages])

    // trigger when the active object is changed
    const updateActiveObject = async (newValue: KGObject | null) => {
        if (newValue) {
            if (newValue.id !== previousActiveObjectId.current) {
                setPaginationPage(0)
            }
            const fetchedObject = await fetchKGObject(newValue);
            const objectChildren = await getObjectChildren(fetchedObject, paginationPage);
            setActiveObject({ ...fetchedObject, ...objectChildren})
            previousActiveObjectId.current = fetchedObject.id
        } else {
            previousActiveObjectId.current = null;
            setActiveObject(null);
        }
    }

    // fetch an individual database object
    const fetchKGObject = async (newValue: KGObject) => {
        const url = BACKEND_RESOURCES.kg.url + `object?table_name=${newValue.objectType}&object_id=${newValue.id}`;
        const response = await fetch(url)
        return await response.json();
    }

    // trigger when the pagination values change
    const updatePaginationPage = async (newValue: number) => {
        if (activeObject) {
            setPaginationPage(newValue);
            const objectChildren = await getObjectChildren(activeObject, newValue);
            setActiveObject({ ...activeObject, ...objectChildren})
            //updateActiveObject({ ...activeObject, ...objectChildren })
        }
    }

    return (
        <div
            className={`absolute top-0 h-full w-full transform ${isChatOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
            {
                isChatOpen && (
                    <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-[-60px] w-16 h-16  flex items-center justify-center rounded-full cursor-pointer bg-primary"
                        onClick={() => {
                            setIsChatOpen(false);
                            setIsDrawerCollapsed(false)
                        }}
                        style={{
                            writingMode: "vertical-rl",
                            textOrientation: "upright",
                            letterSpacing: "-6px"
                        }}
                        title="Close COREII Chat"
                    >
                        <FaChevronRight className="text-white" />
                    </button>
                )
            }

            {!isChatOpen && (
                <button
                    className="absolute top-1/2 transform -translate-y-1/2  w-16 h-16 0 flex items-center justify-center rounded-full cursor-pointer bg-primary"
                    onClick={() => {
                        setIsChatOpen(true);
                        setIsDrawerCollapsed(true);
                    }}
                    style={{
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                        letterSpacing: "-6px",
                        left: isDrawerCollapsed? "-133px" :"-400px",
                    }}
                    title="Open COREII chat"
                >
                    <FaBars className="text-white" />
                </button>
            )}
            <div
                className="w-100 h-full shadow-lg px-12 py-6 flex flex-col overflow-scroll dark:bg-slate-800 bg-gray-300 dark:text-white text-black"
            >
                <h2 className="font-bold text-4xl">
                    <span className="text-white">CORE</span>
                    <span className="text-primary">Chat</span>
                </h2>
                <button
                    onClick={handleCLose}
                    className="absolute top-4 right-4 text-white text-lg leading-none"
                    aria-label="Close chat panel"
                >
                    &times;
                </button>

                <div
                    className="flex flex-1 min-h-0"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        className="overflow-y-auto mt-4 pr-4 pb-16"
                        style={{ width: `${leftWidth}%` }}
                        ref={chatScrollDivRef}
                    >
                        <h3 className="mb-4 text-2xl">Search and Chat</h3>
                        <ChatManager
                            onUpdateActiveObject={updateActiveObject}
                            updateMessages={setMessages}
                            messages={messages}
                            showChatOptions={showChatOptions}
                            updateShowChatOptions={setShowChatOptions}
                        />
                    </div>

                    <div
                        className="w-3 bg-gray-400 hover:bg-primary dark:bg-gray-600 dark:hover:bg-primary cursor-col-resize transition-colors flex justify-center flex-col"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="flex justify-center">
                            <FaGripLinesVertical className="text-white dark:text-white" />
                        </div>
                    </div>

                    <div
                        className="overflow-y-auto"
                        style={{ width: `${100 - leftWidth}%` }}
                    >
                        <div className="pt-4 px-4">
                            <h3 className="mb-4 text-2xl">Knowledge Graph Browser</h3>
                            <div>
                                <KGBrowser
                                    activeObject={activeObject}
                                    paginationPage={paginationPage}
                                    onUpdateActiveObject={updateActiveObject}
                                    onUpdatePaginationPage={updatePaginationPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
        ;
};

export default ChatComponent;