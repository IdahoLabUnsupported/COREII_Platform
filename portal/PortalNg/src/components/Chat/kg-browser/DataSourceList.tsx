// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject } from '../shared/interfaces';
import Ping from '../Ping'


export default function DataSourceList({
    dataSources,
    onUpdateActiveObject,
} : {
    dataSources: KGObject[],
    onUpdateActiveObject: (newValue: KGObject | null) => void,
}) {
    return (
        <div className="space-y-2">
            {dataSources.length > 0 ? (
                dataSources.map(row => (
                    <div key={row.id}>
                        <button
                            className="w-full text-left rounded-2xl px-4 py-2 shadow-lg border border-primary hover:bg-primary transition-colors"
                            onClick={() => {
                                onUpdateActiveObject({objectType: "source", id: row.id})
                            }}
                        >
                            <p className="text-lg font-bold">{row.title}</p>
                            {row.description && row.description !== row.title && (
                                <p className="text-xs text-muted">
                                    {row.description}
                                </p>
                            )}
                        </button>
                    </div>
                ))
            ) : (
                <div className="mx-auto mt-12">
                    <div className="text-center">
                        <p className="text-muted">Loading...</p>
                        <div className="flex justify-center">
                            <Ping />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}