// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from "react";

import "./Dashboard.css";
import DashboardItem from "./DashboardItem";

export default function Dashboard({ dashItems }) {
    return (
        <div className="dashboard-container dark:text-white  grid grid-cols-2 gap-4">
            {dashItems.map((dashItem,index) => {
                return (

                    <DashboardItem
                        key={`${dashItem.title}-${index}`}
                        title={dashItem.title}
                        imageLocation={dashItem.imageLocation}
                        trlLevel={dashItem.trlLevel}
                        launchFunc={dashItem.launchFunc}
                        infoRoute={dashItem.infoRoute}
                        applicationSourceUrl={dashItem.applicationSourceUrl}
                        applicationUrl={dashItem.applicationUrl}
                    >
                        {dashItem.body}
                    </DashboardItem>
                );
            })}
        </div>
    );
}
