// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as React from "react";
import LayoutDashboard from "../layouts/LayoutDashboard";
//CSS
import "./page.css";

type Props = object;

const PageDashboard: React.FC<Props> = () => {
    return (
        <div className="page-component overflow-y-scroll dark:bg-slate-800">
            <LayoutDashboard />
        </div>
    );
};

export default PageDashboard;
