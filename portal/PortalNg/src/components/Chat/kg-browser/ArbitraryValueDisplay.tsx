// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject } from '../shared/interfaces'

export default function ArbitraryValueDisplay({ value } : { value: KGObject | KGObject[] | number | string | string[] | object | undefined | null }) {
    return (
        <div>
            {typeof value === 'string' ? (
                <p>{value}</p>
            ) : typeof value === 'number' ? (
                <p>{value.toString()}</p>
            ): Array.isArray(value) ? (
                (value.map((v, vIdx) => (
                    <div key={vIdx}>
                        <ArbitraryValueDisplay value={v} />
                    </div>
                )))
            ) : (
                <pre className="text-xs">{JSON.stringify(value, null, 4)}</pre>
            )}
        </div>
    )
}