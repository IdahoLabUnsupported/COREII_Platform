// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from "react";

type Props = {
    children: any,
    className?: string
};

const CardContent: React.FC<Props> = ({ children, className }) => {
    return (
        <div
            className="card p-5 bg-slate-400 dark:bg-gray-700 text-gray-800 dark:text-white overflow-hidden flex align-middle"
            style={{ minHeight: "15rem" }}>
            {children}
        </div>
    );
};

export default CardContent;
