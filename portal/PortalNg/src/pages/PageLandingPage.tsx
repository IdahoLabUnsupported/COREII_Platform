// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from "react";

// Custom Components
import LayoutLandingPage from "../layouts/LayoutLandingPage";


//CSS
import "./page.css";

type Props = object;

const PageLandingPage: React.FC<Props> = () => {
    
    return (
        <div className="page-component overflow-y-scroll dark:bg-slate-800">
            <LayoutLandingPage />
        </div>
    );
};

export default PageLandingPage;
