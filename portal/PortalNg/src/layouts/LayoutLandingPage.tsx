// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from "react";
import { useEffect, useState } from "react";
import Hero from "../components/elements/Hero";
import CardStatusNested from "../components/cards/CardStatusNested";
import CardContentTextArea from "../components/cards/CardContentTextArea";
import CardContent from "../components/cards/CardContent";
import SectionIcon from "../components/elements/SectionIcon";
import ButtonBasic from "../components/elements/ButtonBasic";
import ChatComponent from "../components/Chat/ChatComponent";
import MOD from "../shared/MOD.json";
import { ThemeContextBlock } from "../contexts/ThemeContextBlock";
import Ecosystem from "../components/elements/ecosystem";
import { GetAIModels, getLatestDatasets, GetModSimModels, getLatestCoreIINews } from "../services/newsServices";
import { GetLatestApplications } from "../services/pageAppService";
import DOMPurify from "dompurify";

type Props = object;

const LayoutLandingPage: React.FC<Props> = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedSection, setSelectedSection] = useState<string>("AI MODELS");
    const [inputValue, setInputValue] = useState<string>("");
    const [submittedValue, setSubmittedValue] = useState<string>("");
    const [latestAIModels, setLatestAIModels] = useState<{
        aiModelName: string;
        aiModelDescription: string,
        url: string
    }[]>([]);
    const { isChatOpen, setIsChatOpen, setIsDrawerCollapsed } = React.useContext(ThemeContextBlock);
    const [latestDatasets, setLatestDatasets] = useState<{ title: string; description: string }[]>([]);
    const [latestModSimDatasets, setLatestModSimDatasets] = useState<{ title: string; content: string }[]>([]);
    const [latestApplications, setLatestApplications] = useState<{ applicationName: string , applicationNews:string}[]>([]);


    useEffect(() => {
        const fetchLatestAIModels = async () => {
            try {
                const response = await GetAIModels();
                if (response.status === 200) {
                    // console.log(response.data)
                    setLatestAIModels(response.data);
                }
            } catch (error) {
                console.error("Error fetching latest AI Models:", error);
            }
        };
        fetchLatestAIModels();
    }, []);

    useEffect(() => {
        const fetchLatestDatasets = async () => {
            try {

                const response = await getLatestDatasets();
                if (response.status === 200) {
                    setLatestDatasets(response.data);
                }
            } catch (error) {
                console.error("Error fetching latest Datasets:", error);
            }
        };
        fetchLatestDatasets();
    }, []);

    useEffect(() => {
        const fetchModSImModels = async () => {
            try {
                const response = await GetModSimModels();
                if (response.status === 200) {

                    setLatestModSimDatasets(response.data);
                }
            } catch (error) {
                console.error("Error fetching latest MOD SIM Models:", error);
            }
        };
        fetchModSImModels();
    }, []);

    useEffect(() => {
        const fetchLatestApplications = async () => {
            try {
                const response = await GetLatestApplications();
                if (response) {

                    setLatestApplications(response);
                }
            } catch (error) {
                console.error("error", error);
            }
        };
        fetchLatestApplications();
    }, []);
    useEffect(() => {
        const savedState = localStorage.getItem("accordionState");
        if (savedState) {
            setIsOpen(JSON.parse(savedState));
        }
    }, []);
    const toggleAccordion = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem("accordionState", JSON.stringify(newState));
    };
    const text = "COREII provides users with a comprehensive suite of DataSets and tools that deliver actionable intelligence specific to OT and ICS environments. Users can align their strategies with industry standards and national objectives, ensuring a proactive and robust defense again evolving threats.";
    const handleSectionClick = (section: string) => {
        setSelectedSection(section);
    };
    const handleSendClick = () => {
        setIsChatOpen(true);
        setIsDrawerCollapsed(true);
        setInputValue("");
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputValue.trim().length > 0) {
            setSubmittedValue(inputValue);
            handleSendClick();

        }
    };
    const sanitizeHTML = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };
    // @ts-ignore
    const [coreiiNews, setCoreiiNews] = useState<{ newsId:string; newsContent:string; }[]>([]);

    useEffect(() => {
        const fetchCoreIINews = async () => {
            try {
                const response = await getLatestCoreIINews();
                if (response.status === 200) {
                    setCoreiiNews(response.data);
                }
            } catch (error) {
                console.error("Error fetching COREII news:", error);
            }
        };
        fetchCoreIINews();
    }, []);
    return (
        <>
            <div className="">
                {/*first section*/}
                <div className="collapse collapse-arrow p-0 m-0">
                    <input type="checkbox" checked={isOpen} onChange={toggleAccordion} />
                    <div className="collapse-title text-xl font-medium cursor-pointer p-0 m-0"
                         onClick={toggleAccordion}>
                    </div>
                    <div className="collapse-content p-0 m-0">
                        {isOpen && <Hero />}
                    </div>
                </div>

            </div>
            <div className="m-6 grid grid-cols-10 gap-4">
                {/*second section chat and DataSets*/}
                <div className="col-span-10 md:col-span-4 flex flex-col">
                    <CardStatusNested title={"Meet COREII"} type="normal" className="flex-grow">
                        <CardContent className="flex-grow h-64">
                            <div className="flex flex-row text-left">
                                <h2 className="font-bold text-3xl"><span><span
                                    className="text-white">CORE</span><span
                                    className="text-primary">Chat</span></span>
                                </h2>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-500 p-4 rounded-lg flex items-center mt-4">
                                <img src={import.meta.env.BASE_URL + "/CyOTE_logo_23-0807_nostars.svg"} alt="Logo"
                                     className="w-8 h-8 mr-2" />
                                <span>Hello. What would you like to know about COREII?</span>
                            </div>
                            <div className="relative mt-4">
                                <input
                                    type="text"
                                    placeholder="Type your question here..."
                                    value={inputValue}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onClick={handleSendClick}
                                    className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-950 pr-10"
                                />
                                <span
                                    className="cursor-pointer material-symbols-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                                    onClick={handleSendClick}
                                >
                                    send
                                </span>
                            </div>
                        </CardContent>
                    </CardStatusNested>
                </div>
                <div className="col-span-10 md:col-span-6 flex flex-col">
                    <CardStatusNested title={"COREII DataSets"} type="normal" className=" flex-grow">
                        <CardContent className="flex-grow h-64">
                            <div className="flex flex-col text-left justify-between">
                                <div className="text-left pb-12">
                                    <p>COREII provides users with a comprehensive suite of DataSets and tools that
                                        deliver actionable intelligence specific to OT and ICS environments. Users can
                                        align their strategies with industry standards and national objectives, ensuring
                                        a proactive and robust defense again evolving threats.</p>
                                </div>

                                <div className="mt-4 pt-10">
                                    <ButtonBasic
                                        link={{
                                            title: "LEARN MORE ABOUT COREII"
                                        }}
                                        color={"btn-primary"}
                                        onClick={handleSendClick}
                                    />
                                </div>
                            </div>
                        </CardContent>

                    </CardStatusNested>
                </div>

            </div>
            {/*third section new in coreII*/}
            <div className="pt-5 ps-10 pe-10">
                <CardStatusNested title=" What's new in COREII" type="normal">
                    <CardContent>
                        <div className="flex flex-col  mt-4">
                            <div className="flex-grow md:flex-grow-7">
                                <div className="grid grid-cols-3 md:grid-cols-8 gap-2">

                                    <SectionIcon icon="home"
                                                 bgColor={`${selectedSection === "AI MODELS" ? "bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white" : "dark:bg-slate-600 bg-slate-300"}`}
                                                 text="AI MODELS"
                                                 onClick={() => handleSectionClick("AI MODELS")} />
                                    <SectionIcon icon="database"
                                                 bgColor={`${selectedSection === "DataSetS" ? "bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white" : "dark:bg-slate-600 bg-slate-300"}`}
                                                 text="DataSetS"
                                                 onClick={() => handleSectionClick("DataSetS")} />
                                    <SectionIcon icon="dns" text="MOD/SIM"
                                                 bgColor={`${selectedSection === "MOD/SIM" ? "bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white" : "dark:bg-slate-600 bg-slate-300"}`}
                                                 onClick={() => handleSectionClick("MOD/SIM")} />
                                    <SectionIcon icon="apps" text="APPLICATIONS"
                                                 bgColor={`${selectedSection === "APPLICATIONS" ? "bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white" : "dark:bg-slate-600 bg-slate-300"}`}
                                                 onClick={() => handleSectionClick("APPLICATIONS")} />
                                    <div className="ms-10">

                                    </div>
                                </div>
                            </div>
                            <div className="w-100 sectionclick  bg-white dark:bg-gray-900  shadow-md   rounded-r-lg rounded-bl-lg">
                                {selectedSection === "AI MODELS" && (
                                    <CardStatusNested title="" type="normal" className="">
                                        <CardContent>
                                            <div>
                                                {latestAIModels.length > 0 ? (
                                                    latestAIModels.map((model, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-4 mb-4 bg-slate-300 dark:bg-slate-600"
                                                        >
                                                            <details
                                                                className="">
                                                                <summary className="dark:text-white cursor-pointer">
                                                                    <a
                                                                    >
                                                                        {model.aiModelName}
                                                                    </a>
                                                                </summary>
                                                                <ul className="list-disc ml-6 mt-2 text-gray-700
                                                                dark:text-gray-300">
                                                                    <li
                                                                        className="ml-4 pl-2 mt-2 text-gray-700 dark:text-gray-300">
                                                                        {model.aiModelDescription}
                                                                    </li>
                                                                </ul>
                                                            </details>
                                                        </div>
                                                    ))
                                                    ) : (
                                                    <p className="text-gray-800 dark:text-gray-300">
                                                        No AI models found.
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </CardStatusNested>
                                )}

                                {selectedSection === "DataSetS" && (
                                    <CardStatusNested title="" type="normal">
                                        <CardContent>
                                            <div>
                                                {latestDatasets.length > 0 ? (
                                                    latestDatasets.map((model, index) => (

                                                        <div
                                                            key={index}
                                                            className="p-4 mb-4 bg-slate-300 dark:bg-slate-600 rounded-lg"
                                                        >
                                                            <details
                                                                className="">
                                                                <summary className="dark:text-white cursor-pointer">
                                                                    <a
                                                                        href="https://www.eia.gov/"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="hover:underline"
                                                                    >
                                                                        {model.title}
                                                                    </a>
                                                                </summary>
                                                                <ul className="list-disc ml-6 mt-2 text-gray-700
                                                                dark:text-gray-300">
                                                                    <li
                                                                        className="ml-4 pl-2 mt-2 text-gray-700 dark:text-gray-300">
                                                                        {model.description}
                                                                    </li>
                                                                    </ul>
                                                            </details>
                                                        </div>
                                                    ))
                                                    ) : (
                                                    <p className="text-gray-800 dark:text-gray-300">
                                                        No Datasets models found.
                                                    </p>
                                                )}
                                            </div>

                                        </CardContent>
                                    </CardStatusNested>
                                )}

                                {selectedSection === "MOD/SIM" && (
                                    <CardStatusNested title="" type="normal">
                                        <CardContent>
                                            <div>
                                                {latestModSimDatasets.length > 0 ? (
                                                    latestModSimDatasets.map((model, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-4 mb-4 bg-slate-300 dark:bg-slate-600 rounded-lg"
                                                        >
                                                            <details
                                                                className="">
                                                                <summary className="dark:text-white cursor-pointer">
                                                                    <a
                                                                    >
                                                                        {model.title}
                                                                    </a>
                                                                </summary>
                                                                <ul className="list-disc ml-6 mt-2 text-gray-700
                                                                dark:text-gray-300">
                                                                    <li
                                                                        className="ml-4 pl-2 mt-2 text-gray-700 dark:text-gray-300"
                                                                        dangerouslySetInnerHTML={sanitizeHTML(model.content)}>

                                                                    </li>
                                                                </ul>
                                                            </details>
                                                        </div>
                                                    ))
                                                    ) : (
                                                    <p className="text-gray-800 dark:text-gray-300">
                                                        No MOD SIM models found.
                                                    </p>
                                                )}
                                            </div>

                                        </CardContent>
                                    </CardStatusNested>
                                )}

                                {selectedSection === "APPLICATIONS" && (
                                    <CardStatusNested title="" type="normal">
                                        <CardContent>
                                            <div>
                                                {latestApplications.length > 0 ? (latestApplications.map((app, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 mb-4 bg-slate-300 dark:bg-slate-600 rounded-lg"
                                                    >
                                                        <details
                                                            className="">
                                                            <summary className="dark:text-white cursor-pointer">
                                                                <a
                                                                >
                                                                    {app.applicationName}
                                                                </a>
                                                            </summary>
                                                            <ul className="list-disc ml-6 mt-2 text-gray-700
                                                                dark:text-gray-300">
                                                                <li
                                                                    className="ml-4 pl-2 mt-2 text-gray-700 dark:text-gray-300"
                                                                    dangerouslySetInnerHTML={sanitizeHTML(app.applicationNews)}>

                                                                </li>
                                                            </ul>
                                                        </details>
                                                    </div>
                                                    ))) : (
                                                    <p className="text-gray-800 dark:text-gray-300">No applications
                                                        found.</p>

                                                )}

                                                {coreiiNews.length > 0 && (
                                                    <div className="p-4 mb-4 bg-slate-300 dark:bg-slate-600 rounded-lg">
                                                        <details>
                                                            <summary className="dark:text-white cursor-pointer">
                                                                <a
                                                                >
                                                                    COREII
                                                                </a>
                                                            </summary>
                                                            <ul className="list-disc ml-6 mt-2 text-gray-700
                                                                dark:text-gray-300">

                                                            {coreiiNews.map((newsItem, index) => (
                                                                <li key={index} className="ml-4 pl-2 mt-2 text-gray-700 dark:text-gray-300"
                                                                >

                                                                    {newsItem.newsContent}

                                                                </li>
                                                            ))}
                                                            </ul>
                                                                </details>
                                                                </div>
                                                                )}
                                                    </div>
                                                    </CardContent>
                                                    </CardStatusNested>
                                                    )}
                                            </div>
                        </div>
                    </CardContent>

                </CardStatusNested>

            </div>
            {/*last section*/}
            <div className="p-10">
                <h4 className="text-xl">
                    COREII Ecosystem
                </h4>
                <CardContent>
                    <div className="my-auto">
                        <Ecosystem></Ecosystem>
                    </div>
                </CardContent>
            </div>
            <ChatComponent isOpen={isChatOpen} setIsOpen={setIsChatOpen} inputValue={inputValue} />
        </>

    );
};

export default LayoutLandingPage;
