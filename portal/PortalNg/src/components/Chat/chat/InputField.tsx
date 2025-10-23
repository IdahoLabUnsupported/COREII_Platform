// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState, ChangeEvent } from "react";

export default function InputField({
    onHandleSubmitMessage,
    preventSubmit,
}: {
    onHandleSubmitMessage: (newValue: string) => void;
    preventSubmit: boolean;
}) {
    const [inputText, setInputText] = useState<string>("");

    // Handle submission of the user message
    const handleSubmit = (value: string) => {
        onHandleSubmitMessage(value);
        setInputText("");
    };

    // Handle enter key being used in the chat box
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && inputText.length > 0) {
            event.preventDefault();
            handleSubmit(inputText);
        }
    };

    // Handle expansino of the chat box when new text is entered
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setInputText(textarea.value);
    };

    return (
        <div className="flex">
            <textarea
                className="pr-8 h-full w-full resize-none overflow-hidden border border-gray-300 p-2 rounded-lg input dark:text-black"
                rows={1}
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search, chat, or ask..."
            />
            <button
                className={`h-10 text-2xl -ml-8 z-40 text-primary hover:text-black mt-auto ${inputText?.length ? 'block' : 'hidden'}`}
                onClick={() => handleSubmit(inputText)}
                disabled={inputText.length < 1 || preventSubmit}
            >
                &#10140;
            </button>
        </div>
    );
}