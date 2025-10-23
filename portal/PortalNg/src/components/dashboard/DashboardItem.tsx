// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from "react";
import ButtonBasic1 from "../elements/ButtonBasic1";

//Custom Components
import ButtonBasic from "../elements/ButtonBasic";
import ModalTriggerButton from "../elements/ModalTriggerButton";

export default function DashboardItem({
    title = "Not Set",
    imageLocation = "public/cyote/cyote-0.png",
    trlLevel = "",
    children = <>Not Set</>,
    launchFunc = null,
    infoRoute = "/",
     applicationSourceUrl = "",
    applicationUrl = ""
}) {
    return (
        <div className="dashboard-item bg-slate-300 text-dark dark:bg-gray-700">
            <div className="dashboard-item-title bg-primary dark:bg-gray-600 ">
                <div
                    style={{
                        backgroundImage: `url(${imageLocation})`,
                        color: "red",
                    }}
                    className="d-i-title-icon"
                ></div>
                <span className="text-2xl">{title}</span>
            </div>
            <div className="dashboard-item-body">
                <div className="d-i-body-text">{children}</div>
                <div className="d-i-body-trl">
                    <ModalTriggerButton
                        buttonLabel={trlLevel}
                        modalTitle="Figure 2 - Technology Readiness Levels"
                        mini={true}
                        imageSrc={
                            import.meta.env.BASE_URL + "/readiness-levels.png"
                        }
                        buttonStyle={{
                            backgroundColor: "#F19C23",
                        }}
                    />
                </div>
                <div className="flex items-center justify-end  text-right">
                    <ButtonBasic1
                        label="Launch App"
                        color="btn-primary"
                        link={applicationUrl}
                        additionalClasses="d-i-button"
                        target="_blank"
                    />
                    <ButtonBasic1
                        label="Info"
                        color="btn-secondary"
                        link={applicationSourceUrl}
                        additionalClasses="d-i-button"
                        target="_blank"
                    />
                </div>
            </div>
        </div>
    );
}
