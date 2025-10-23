// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as React from "react";

type Props = {
    children: any,
    className?: string
};

const CardDatasets: React.FC<Props> = ({ children, className }) => {
    return (
        <div
            className="card bg-slate-400 dark:bg-gray-700 text-gray-800 dark:text-white overflow-hidden flex flex-col min-h-[25rem]"
        >
            <div className="p-5 min-h-[5rem] ">
                {children[0]}
            </div>
            <div className="bg-slate-300 dark:bg-gray-600 text-gray-700 dark:text-white p-5" style={{ flex: "1 0 70%" }}>
                <div className="border-b border-gray-400 dark:border-gray-500">test</div>
                {children[1]}
            </div>
        </div>
    );
};

export default CardDatasets;