// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import { useEffect, useState } from "react";
import * as React from "react";
import { Modal, Button, Carousel } from "react-bootstrap";

// Custom Components
import CardContent from "../components/cards/CardContent";
import ModalTriggerButton from "../components/elements/ModalTriggerButton";
import Dashboard from "../components/dashboard/Dashboard";
import CarouselComponent from "../components/elements/CarouselComponent";
import { title } from "process";
import { getApplications } from "../services/pageAppService"; 
import axiosInstance from '../api/axios';

type Props = object;
interface IDashboardItems {
    title:string;
    imageLocation:string;
    trlLevel: string;
    launchFunc(): any;
    infoRoute: string;
    body:any;
    applicationSourceUrl:string;
    applicationUrl:string;

}
const LayoutDashboard: React.FC<Props> = () => {
    const [dashboardResults, setDashboardResults] = useState<any>([]); 
       
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getApplications();
            let dashboard:IDashboardItems[] = []
            data.forEach((val) => {
                var tempDash:IDashboardItems = {
                    title: val.applicationName,
                    imageLocation:`${axiosInstance.defaults.baseURL}/Uploads/${val.applicationIcon}`,
                    trlLevel: 'TRL ' + val.tlr,
                    launchFunc: () => {
                        alert(val.applicationName + ' launch');
                    },
                    infoRoute: '/'+val.applicationName, 
                    body: (
                        <>{val.textSummary}</>
                    ),
                    applicationSourceUrl: val.applicationSourceUrl,
                    applicationUrl: val.applicationUrl
                }
                dashboard.push(tempDash);
            });
            setDashboardResults(dashboard);
          } catch (error) {
            console.error("Error fetching resources:", error);
          }
        };
    
        fetchData();
      }, []);
    // const dashboardItems:IDashboardItems[] = [
    //     {
    //         title: "Optic",
    //         imageLocation: `${import.meta.env.BASE_URL}/CyOTE_logo_23-0807_nostars.svg`,
    //         trlLevel: "TLR 5",
    //         launchFunc: () => {
    //             alert("optic launch");
    //         },
    //         infoRoute: "/optic",
    //         body: (
    //             <>
    //                 OPTIC enhances OT cybersecurity by sharing intelligence on adversarial tactics,
    //                 leveraging tools for situational awareness, maturity improvement, micro-baselining, and iterative investigation.
    //
    //             </>
    //         ),
    //     },
    //     {
    //         title: "Bam",
    //         imageLocation: `${import.meta.env.BASE_URL}/cyotelogo.png`,
    //         trlLevel: "TLR 2",
    //         launchFunc: () => {
    //             alert("optic launch");
    //         },
    //         infoRoute: "/bam",
    //         body: (
    //             <>
    //                 BAM enhances OT security by using Bayesian inference and MITRE ATT&CK®
    //                 for ICS to estimate the likelihood of adversarial behaviors based on observed evidence.
    //             </>
    //         ),
    //     },
    //     {
    //         title: "Catch",
    //         imageLocation: `${import.meta.env.BASE_URL}/OPTICLogoEye.svg`,
    //         trlLevel: "TLR 3",
    //         launchFunc: () => {
    //             alert("optic launch");
    //         },
    //         infoRoute: "/catch",
    //         body: (
    //             <>
    //                 CATCH enhances security controls by using Collection Engines and Analysis Modules to gather,
    //                 analyze, and report anomalous telemetry data, correlating it with MITRE ICS ATT&CK patterns.
    //             </>
    //         ),
    //     },
    //     {
    //         title: "Insights",
    //         imageLocation: `${import.meta.env.BASE_URL}/OPTICLogoEye.svg`,
    //         trlLevel: "TLR 3",
    //         launchFunc: () => {
    //             alert("optic launch");
    //         },
    //         infoRoute: "/insights",
    //         body: (
    //             <>
    //                 Insights enhances CISO-executive communication and decision-making in OT cybersecurity
    //                 by providing actionable data from historical analysis, real-time dashboards, and predictive analytics.
    //             </>
    //         ),
    //     },
    //     {
    //         title: "Scout",
    //         imageLocation: `${import.meta.env.BASE_URL}/OPTICLogoEye.svg`,
    //         trlLevel: "TLR 3",
    //         launchFunc: () => {
    //             alert("optic launch");
    //         },
    //         infoRoute: "/scout",
    //         body: (
    //             <>
    //                 Scout accelerates cybersecurity reporting by using AI/ML to collect, summarize,
    //                 and correlate events from open-source and public data.
    //             </>
    //         ),
    //     },
    // ];

    return (
        <>
            <div className="p-10">
                <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">
                    Core II Applications
                </h2>

                <Dashboard dashItems={dashboardResults}></Dashboard>
            </div>
        </>
    );
};
export default LayoutDashboard;
