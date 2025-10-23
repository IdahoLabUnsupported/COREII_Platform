// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject } from '../shared/interfaces';
import { cleanKey } from '../shared/utils';
import { useState } from "react";


export default function Breadcrumbs({
    activeObject,
    onUpdateActiveObject,
}: {
    activeObject: KGObject | null,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {
    const getClipPathStyle = (position: "first" | "middle" | "last") => {
        if (position === "first") {
            return { clipPath: "polygon(0% 0%, calc(100% - 25px) 0%, 100% 50%, calc(100% - 25px) 100%, 0% 100%)" };
        }
        if (position === "middle") {
            return { clipPath: "polygon(0% 0%, calc(100% - 25px) 0%, 100% 50%, calc(100% - 25px) 100%, 0% 100%, 25px 50%)", marginLeft: "-24.5px" };
        }
        return { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 25px 50%)",marginLeft: "-25.5px" };
    };
    const [highlightedId, setHighlightedId]=useState<string>('lastTab');
    const truncateText=(text:string,maxLength:number)=>{
        return text.length >maxLength ? `${text.slice(0,maxLength)}...` :text;
    }

    return (
        <div className="flex flex-row px-2 py-2 bg-gray-300 dark:bg-gray-800 rounded">
            <div className="join gap-0.5">
                {activeObject && activeObject.objectType === 'uentity' ? (
                    <div    className={`inline-block text-sm font-medium px-4 py-2 whitespace-nowrap rounded-lg text-white w-48  ${activeObject?.objectType === "uentity" ? "bg-[#00527c]" : "bg-[#00527c]"} hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light`}
                            style={getClipPathStyle("first")}>
                        <p className="text-sm pl-2 uppercase font-semibold text-white ">All Data</p>
                        <p className="text-sm text-white ">Unique entities</p>
                    </div>
                ) : (
                    <div className="tooltip tooltip-top cursor-pointer"  onClick={() => {
                        onUpdateActiveObject(null);
                    }}
                         data-tip="Data Sources">
                        <div
                            className="text-left px-4 py-2 font-medium hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light rounded-lg bg-[#00527c]  w-48 hover-trigger hover:filter hover:brightness-75 hover:shadow-lg hover:scale-105"
                            style={getClipPathStyle("first")}>
                            <p className="text-sm uppercase font-semibold text-white">COREII</p>
                            <button
                                className="inline-block  text-white text-sm font-medium px-4 py-1 whitespace-nowrap "

                            >
                                Data sources
                            </button>
                        </div>

                    </div>
                )}
                {activeObject && (
                    <>

                        {activeObject.source && typeof activeObject.source !== "string" && (
                            <div className="tooltip tooltip-top cursor-pointer"  onClick={() => {
                                if (typeof activeObject.source === "object") {
                                    onUpdateActiveObject({
                                        objectType: "source",
                                        id: activeObject.source.id
                                    });
                                }
                            }}
                                 data-tip={activeObject.source.title}>
                                <div className={`text-left inline-block text-sm font-medium px-4 py-2 whitespace-nowrap rounded text-white w-48 hover-trigger hover:filter hover:brightness-75 hover:shadow-lg hover:scale-105  ${activeObject?.objectType === "source" ? "bg-[#00527c] " : "bg-[#00527c]"} hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light`}
                                     style={getClipPathStyle("middle")}>
                                    <p className="text-sm pl-2 uppercase font-semibold text-white">Data Source</p>
                                    <button
                                        className="inline-block  text-white text-sm font-medium px-4 py-1 whitespace-nowrap rounded tooltip tooltip-arrow tooltip-top"

                                    >
                                        {truncateText(activeObject.source.title, 20)}
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeObject.report && typeof activeObject.report !== "string" && (
                            <div className="tooltip tooltip-top cursor-pointer" data-tip={activeObject.report.title}  onClick={() => {
                                if (typeof activeObject.report === "object") {
                                    onUpdateActiveObject({
                                        objectType: "report",
                                        id: activeObject.report.id
                                    });
                                }
                            }}>
                                <div  className={`text-left inline-block text-sm font-medium px-4 py-2 whitespace-nowrap rounded text-white w-48  hover-trigger hover:filter hover:brightness-75 hover:shadow-lg hover:scale-105 ${activeObject?.objectType === "source" ? "bg-[#00527c]" : "bg-[#00527c]"} hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light`}
                                      style={getClipPathStyle("middle")}>
                                    <p className="text-sm uppercase font-semibold pl-2 text-white">Report</p>
                                    <button
                                        className=" text-white text-sm font-medium px-4 py-1 rounded tooltip tooltip-arrow tooltip-top"

                                    >
                                        {truncateText(activeObject.report.title, 20)}
                                    </button>
                                </div>

                            </div>
                        )}
                        {activeObject.excerpt && typeof activeObject.excerpt !== 'string' && (
                            <div className="tooltip tooltip-top cursor-pointer"  onClick={() => {
                                if (typeof activeObject.excerpt === "object") {
                                    onUpdateActiveObject({
                                        objectType: "excerpt",
                                        id: activeObject.excerpt.id
                                    });
                                }
                            }}
                                 data-tip={activeObject.excerpt.title}>
                                {/*<div*/}
                                {/*    className={`text-left bg-primary p-1 pl-3  w-48 relative hover-trigger hover:filter hover:brightness-75 hover:shadow-lg hover:scale-105 ${highlightedId === "middle" ? "bg-primary animate" : "bg-primary-inactive"}`}
                                */}
                                <div className={`text-left inline-block text-sm text-white font-medium px-4 py-2 whitespace-nowrap rounded w-48 hover-trigger hover:filter hover:brightness-75 hover:shadow-lg hover:scale-105  
                                ${activeObject?.objectType === "source" ? "bg-[#00527c]" : "bg-[#00527c]"} hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light`}
                                    style={getClipPathStyle("middle")} onClick={() => {
                                    setHighlightedId("middle");
                                }}>
                                    <p className="text-sm uppercase font-semibold pl-2 text-white">Excerpt</p>
                                    <button
                                        className="text-white text-sm font-medium px-4 py-1 rounded tooltip tooltip-arrow tooltip-top"

                                    >
                                        {truncateText(activeObject.excerpt.title, 20)}
                                    </button>
                                </div>

                            </div>
                        )}
                        <div className="tooltip tooltip-top cursor-default"
                             data-tip={cleanKey(activeObject.title)}>
                            <div
                                className={`text-left bg-primary p-1.5 pl-3 w-48 rounded-r-lg ${highlightedId === "lastTab" ? "bg-primary animate" : "bg-primary-inactive"}`}
                                style={getClipPathStyle("last")} onClick={() => {
                                setHighlightedId("lastTab")
                            }}>
                                <div
                                    className="inline-block  text-white text-sm font-medium px-4 py-1 whitespace-nowrap rounded  ">
                                    <p className="text-white text-sm uppercase font-semibold">{cleanKey(activeObject.objectType)}</p>
                                    <p className="text-white text-sm mt-1">{truncateText(activeObject.title, 20)}</p>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>

        </div>
    )
}
