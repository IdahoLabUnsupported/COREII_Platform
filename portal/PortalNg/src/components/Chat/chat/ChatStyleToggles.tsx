// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import './slider.css'

export default function ChatStyleToggles({
    temperature,
    diversity,
    updateTemperature,
    updateDiversity,
    updateShowChatOptions,
}) {

    return (
        <div className="border p-4 rounded-2xl overflow-x-auto">
            <div className="flex justify-between space-x-4">
                <p className="font-bold text-center">
                    Chat options
                </p>
                <button
                    className="link"
                    onClick={() => updateShowChatOptions(false)}
                >
                    &#10005;
                </button>
            </div>
            <div className="flex flex-col mt-3 space-y-3">
                <div>
                    <p className="text-sm font-bold">Response style</p>
                    <p className="text-xs text-muted">
                        When the response is more consistent, the chatbot will give the exact same answer every time.
                        When the response is more creative, the chatbot will respond more freely, resulting in a different response each time. A setting in the middle will give a balanced reponse.
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-xs">
                        <span className="whitespace-nowrap font-bold">
                            More consistent
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.5"
                            className="w-16 appearance-none"
                            value={temperature}
                            onChange={(e) => updateTemperature(e.target.value)}
                        />
                        <span className="whitespace-nowrap font-bold">
                            More Creative
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold">Data retrieval</p>
                    <p className="text-xs text-muted">
                        When relevancy is favored, only data which most closely matches the user's query will be retrieved, even if that data only comes from a single data source.
                        When breadth of data is favored, the system ensures that data is retrieved from several data sources, even if some of those sources did not contain data that was highly relevant.
                        A setting in the middle will favor relevancy while ensuring that more than one dataset is represented. This setting will be overridden if the user explicitly requests information from only one source.
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-xs">
                        <span className="whitespace-nowrap font-bold">
                            Most relevant
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.5"
                            className="w-16 appearance-none"
                            value={diversity}
                            onChange={(e) => updateDiversity(e.target.value)}
                        />
                        <span className="whitespace-nowrap font-bold">
                            Most breadth
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
