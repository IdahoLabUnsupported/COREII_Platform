// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState } from 'react'
import { KGObject } from '../shared/interfaces' 

export default function SimilarityScorePlot({
    items,
    indexThreshold = 4,
    onUpdateActiveObject,
}: {
    items: KGObject[],
    indexThreshold: number,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {
    const [displayIndex, setDisplayIndex] = useState<number | null>(null)
    const maxScore = Math.max(...items.map(x => x?.similarityScore || 0))
    const minScore = Math.min(...items.map(x => x?.similarityScore || 0))
    return (
        <div>
            {/* 
            <p className="text-xs text-center">
                Found {indexThreshold + 1} results most relevant to your message
            </p>
            */}
            <div className="flex items-end w-full space-x-[1px]">
                {items
                    .slice()
                    .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
                    .map((item, index) => {
                        return (
                            <button
                                key={index}
                                className={`w-full ${index <= indexThreshold ? 'bg-primary hover:bg-secondary' : 'bg-slate-200 hover:bg-secondary'}`}
                                style={{ height: `${((item?.similarityScore || 0) - minScore) / (maxScore - minScore) * 60}px` }}
                                onMouseOver={() => { setDisplayIndex(index) }}
                                onMouseLeave={() => { setDisplayIndex(null) }}
                                onClick={() => {
                                    onUpdateActiveObject({
                                        objectType: item.objectType,
                                        id: item.id
                                    })
                                }}
                            >
                            </button>
                        )
                    })}
            </div>
            <div className="h-8">
                {displayIndex !== null && (
                    <p className={`text-xs ${displayIndex <= indexThreshold ? 'text-primary' : 'text-muted'}`}>
                        {items[displayIndex].title}, score: {items[displayIndex].similarityScore}
                    </p>
                )}
            </div>
        </div>
    )
}