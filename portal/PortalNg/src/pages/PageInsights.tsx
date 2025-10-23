// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import {useState, useEffect} from "react";
import * as React from "react";
import GeneralLayout from "../layouts/PageLayout"
import { getApplicationByName } from "../services/pageAppService";
import insights1 from "../assets/Insights1.png";
import insights2 from "../assets/Insights2.png";
import insights3 from "../assets/Insights3.png";

type Props = object;

const PageInsights: React.FC<Props> = () => {
    const [appResults, setAppResults] = useState<any>({});
    const [imageResults, setImageResults] = useState<any>([]); 

   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getApplicationByName("Insights");
            setAppResults(data.application);
            setImageResults(data.applicationImages);
          } catch (error) {
            console.error("Error fetching resources:", error);
          }
        };
    
        fetchData();
      }, []);

    return (
        <div className="page-component overflow-y-scroll dark:bg-slate-800">
        <GeneralLayout
            title= {appResults?.applicationName}
            buttons={{
                first: { text: "Launch " + appResults.applicationName, link: appResults.applicationUrl },
                second: { text: appResults.applicationName + " Source Code", link: appResults.applicationSourceUrl }
            }}
            sections={{
                intro:  appResults.textWorks,
                dataOrigin: appResults.textData,
                utility: appResults.textHelps,
                images: imageResults?.map((image, index) =>
                  <div key={index} className={["keen-slider__slide", "number-slide" + index].join(' ')}><img className="slider-height" src={import.meta.env.BASE_URL+'/'+image.imagePath} alt=""/></div>
                ), 
                thumbs: imageResults?.map((image, index)=> 
                  <div key={index} className={["keen-slider__slide", "number-slide" + index].join(' ')}><img src={import.meta.env.BASE_URL+'/'+image.imagePath} alt=""/></div>
                )
            }}
            modalInfo={{
                buttonLabel: "TRL " + appResults.tlr,
                modalTitle: "Figure 2 - Technology Readiness Levels",
                imageSrc: import.meta.env.BASE_URL + "/readiness-levels.png",
                buttonStyle: { backgroundColor: "#F19C23" }
            }}
        />
    </div>
    );
};

export default PageInsights;
