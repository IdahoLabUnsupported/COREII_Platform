// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState, useEffect } from "react";
import * as React from "react";
import GeneralLayout from "../layouts/PageLayout";
import { getApplicationByName } from "../services/pageAppService";
import axiosInstance from '../api/axios';
import { useParams } from "react-router-dom";

type Props = object;

const PageDynamicApp: React.FC<Props> = () => {
    const { appName } = useParams<{ appName: string }>();
    const [appResults, setAppResults] = useState<any>({});
    const [imageResults, setImageResults] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getApplicationByName(appName);
                setAppResults(data.application);
                setImageResults(data.applicationImages);
            } catch (error) {
                console.error("Error fetching resources:", error);
            }
        };

        fetchData();
    }, [appName]);

    return (
        <div className="page-component overflow-y-scroll dark:bg-slate-800">
            <GeneralLayout
                title={appResults.applicationName}
                buttons={{
                    first: { text: "Launch " + appResults.applicationName, link: appResults.applicationUrl },
                    second: { text: appResults.applicationName + " Source Code", link: appResults.applicationSourceUrl }
                }}
                sections={{
                    intro:  appResults.textWorks,
                    dataOrigin: appResults.textData,
                    utility: appResults.textHelps,
                    images: imageResults?.map((image, index) =>
                        <div key={index} className={["keen-slider__slide", "number-slide" + index].join(' ')}><img className="slider-height" src={`${axiosInstance.defaults.baseURL}/Uploads/${image.imagePath}`} alt=""/></div>
                    ),
                    thumbs: imageResults?.map((image, index)=>
                        <div key={index} className={["keen-slider__slide", "number-slide" + index].join(' ')}><img src={`${axiosInstance.defaults.baseURL}/Uploads/${image.imagePath}`} alt=""/></div>
                    )
                }}
                modalInfo={{
                    buttonLabel: "TLR " + appResults.tlr,
                    modalTitle: "Figure 2 - Technology Readiness Levels",
                    imageSrc:   import.meta.env.BASE_URL + "/readiness-levels.png",
                    buttonStyle: { backgroundColor: "#F19C23" }
                }}
            />
        </div>
    );
};

export default PageDynamicApp;