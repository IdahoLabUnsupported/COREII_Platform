// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from "react";
import AIModelsTab from "../components/news/AIModelsTab";
import DatasetsTab from "../components/news/DatasetsTab";
import ModSimTab from "../components/news/ModSimTab";
import ApplicationsTab from "../components/news/ApplicationTabs";

const PageWhatsNewCore: React.FC = () => {
    const [activeTab, setActiveTab] = useState("AI Models");
    const tabs = ["AI Models", "Datasets","MOD/Sim", "Applications"];
    return (
        <div className="page-component dark:bg-slate-800 min-h-screen p-10">
<h2 className="text-4xl mb-8 text-gray-800 dark:text-white">
    {"What’s New In COREII"}
</h2>
    <div className="flex justify-left pt-4">
    <div role="tablist" className="tabs tabs-lifted w-full max-w-4xl">
    {tabs.map((tab) => (
        <button
            key={tab}
            className={`tab ${
                activeTab === tab ? "tab-active [--tab-bg:#2C7ABA] text-black" : ""
            }`}
            onClick={() => setActiveTab(tab)}
        >
            {tab}
        </button>
    ))}
</div>
</div>
    <div className="p-10 rounded-lg shadow-md mt-4 h-full">
    {activeTab === "AI Models"&& <AIModelsTab />}
    {activeTab === "Datasets" && <DatasetsTab />}
    {activeTab === "MOD/Sim" && <ModSimTab />}
    {activeTab === "Applications" && <ApplicationsTab />}
</div>
</div>
);
};

export default PageWhatsNewCore;