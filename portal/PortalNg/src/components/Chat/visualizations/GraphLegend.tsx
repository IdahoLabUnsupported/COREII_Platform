// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { ICON_MAP } from '../shared/constants';

export default function GraphLegend({ showUserQuery = false } : { showUserQuery: boolean }) {
    const keys = ["source", "report", "excerpt", "entity"];
    if (showUserQuery) {
         keys.splice(0, 0, "query")
    }
    return (
        <div className="flex flex-col gap-2 text-xs">
            {keys.map((key) => {
                const item = ICON_MAP[key as keyof typeof ICON_MAP];
                return (
                    <div
                        key={key}
                        className="flex items-center gap-1"
                        style={{ color: item.color }}
                    >
                        <div className="pt-0.5">
                            <svg
                                viewBox="0 0 16 16"
                                width="16"
                                height="16"
                                className="flex-shrink-0"
                            >
                                <path
                                    d={item.path}
                                    fill="currentColor"
                                    fillRule={key === "uentity" ? "evenodd" : "nonzero"}
                                />
                            </svg>
                        </div>
                        <div className="whitespace-nowrap">
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}