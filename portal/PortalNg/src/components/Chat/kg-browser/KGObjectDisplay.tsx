// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import Pagination from './Pagination';
import ArbitraryValueDisplay from './ArbitraryValueDisplay';
import ObjectRelationshipGraph from '../visualizations/ObjectRelationshipGraph'
import { getExcerptPreviewText } from '../shared/utils'
import { KGObject } from '../shared/interfaces';
import { cleanKey } from '../shared/utils';

export default function KGObjectDetailsDisplay({
    activeObject,
    paginationPage,
    onUpdateActiveObject,
    onUpdatePaginationPage,
}: {
    activeObject: KGObject,
    paginationPage: number,
    onUpdateActiveObject: (newValue: KGObject | null) => void,
    onUpdatePaginationPage: (newValue: number) => void,
}) {

    const HIDE_KEYS = ["id", "sha256hash", "objectType", "content_type"];
    if (activeObject.description === activeObject.text_content) {
        HIDE_KEYS.push('description')
    }
    const stringKeys = Object.keys(activeObject)
        .filter(key => typeof activeObject[key as keyof typeof activeObject] === 'string')
        .filter(k => !HIDE_KEYS.includes(k))
        .filter(k => !k.endsWith("_id"));

    const childKeys = ["reports", "excerpts", "entities"].filter(key => activeObject[key as keyof typeof activeObject]);
    const jsonKeys = ["report_metadata", "json_content"].filter(key => activeObject[key as keyof typeof activeObject]);
    const parentKeys = ["source", "report", "excerpt", "uentity"].filter(key => activeObject[key as keyof typeof activeObject]);

    const isUrl = (value: string): boolean => {
        return typeof value === "string" && /^https?:\/\/\S+$/.test(value);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold">{activeObject.title}</h2>

            <div className="">
                <table className="mt-4 w-full border-separate border-spacing-5">
                    <tbody>
                        {stringKeys.map(key => (
                            <tr key={key}>
                                <td className="font-bold align-top whitespace-nowrap pb-0">
                                    {cleanKey(key)}
                                </td>
                                <td>
                                    {isUrl(activeObject[key as keyof typeof activeObject] as string) ? (
                                        <a
                                            className="link"
                                            href={(activeObject[key as keyof typeof activeObject] as string)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {(activeObject[key as keyof typeof activeObject] as string)}
                                        </a>
                                    ) : (
                                        <div>
                                            {String(activeObject[key as keyof typeof activeObject])}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {parentKeys.map(key => (
                            <tr key={`parent-${key}`}>
                                <td className="font-bold align-top whitespace-nowrap pb-0 pr-3">
                                    {cleanKey(key)}
                                </td>
                                <td>     
                                    <button
                                        className="link text-left"
                                        onClick={() => {
                                            onUpdateActiveObject({
                                                objectType: (activeObject[key as keyof typeof activeObject] as KGObject).objectType,
                                                id: (activeObject[key as keyof typeof activeObject] as KGObject).id
                                            })
                                        }}
                                    >
                                        {(activeObject[key as keyof typeof activeObject] as KGObject).title}
                                    </button>
                                </td>
                            </tr>
                        ))}


                        {childKeys.map(key => (
                            <tr key={key}>
                                <td className="font-bold align-top whitespace-nowrap pb-0 pr-3">
                                    {cleanKey(key)}
                                </td>
                                {(activeObject[key as keyof typeof activeObject] as KGObject[]).length > 0 ? (

                                    <td className="py-4 space-y-2">
                                        {(activeObject?.pagination?.lastPage ?? 0) + 1 > 1 && (
                                            <div className="bg-light rounded-3xl py-1">
                                                <Pagination
                                                    activeObject={activeObject}
                                                    paginationPage={paginationPage}
                                                    onUpdatePaginationPage={onUpdatePaginationPage}
                                                />
                                            </div>
                                        )}
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-muted">
                                            {(activeObject[key as keyof typeof activeObject] as KGObject[])
                                                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
                                                .map((_obj: KGObject, idx: number) => (
                                                   <li key={_obj.id}>
                                                        <button
                                                            className="link text-left space-x-2 block"
                                                            onClick={() => {
                                                                onUpdateActiveObject({
                                                                    objectType: _obj.objectType,
                                                                    id: _obj.id
                                                                })
                                                            }}
                                                        >
                                                            {key === 'excerpts' ? (
                                                                <span>
                                                                    {getExcerptPreviewText(_obj)}
                                                                </span>
                                                            ) : (
                                                                <span>{_obj.title}</span>
                                                            )}
                                                            
                                                            
                                                            {key === 'entities' && activeObject.objectType === "uentity" && (
                                                                <span className="text-xs">
                                                                    [{_obj.id?.split("-")[0]}]
                                                                </span>
                                                            )}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </td>
                                ) : (
                                    <td>None</td>
                                )}
                            </tr>
                        ))}
                        {jsonKeys.map(key => (
                            <tr key={key}>
                                <td className="font-bold align-top pb-0 pr-3">
                                    {cleanKey(key)}
                                </td>
                                <td>
                                    <div className="space-y-6 mx-w-full overflow-auto">
                                        {activeObject[key as keyof typeof activeObject] && typeof activeObject[key as keyof typeof activeObject] === 'object' && !Array.isArray(activeObject[key as keyof typeof activeObject]) && Object.entries(activeObject[key as keyof typeof activeObject] as object).map(([key_, value_]) => (
                                            <div key={key_}>
                                                <div className="font-bold text-muted text-sm mb-1">
                                                    {cleanKey(key_).toUpperCase()}
                                                </div>
                                                <ArbitraryValueDisplay value={value_} />
                                            </div>
                                        ))}
                                        <div>
                                            <div className="font-bold text-muted text-sm mb-1">
                                                RAW METADATA
                                            </div>
                                            <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(activeObject[key as keyof typeof activeObject], null, 2)}</pre>
                                        </div>
                                       
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="font-bold align-top pb-0 pr-3">
                                Relationship Map
                            </td>
                            <td className="pt-2">
                                <ObjectRelationshipGraph
                                    activeObject={activeObject}
                                    onUpdateActiveObject={onUpdateActiveObject}
                                    width={300}
                                    height={300}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*
            <div className="overflow-x-auto">
                <pre className="text-xs">{JSON.stringify(obj, null, 4)}</pre>
            </div>
            
            */}
            
        </div>
    )
}
