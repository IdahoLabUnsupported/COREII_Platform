// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
export default function Ping() {
    return (
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-slate-300"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary dark:bg-slate-300"></span>
        </span>
    )
}

