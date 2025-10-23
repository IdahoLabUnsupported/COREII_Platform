// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState } from "react";
import CardDatasets from "../components/cards/CardDatasets";

type Props = object;

const PageDatasets: React.FC<Props> = () => {
    // Dummy data array
    const dummyData = Array.from({ length: 16 }, (_, index) => ({
        title: `Title ${index + 1}`,
        text1: `Text 1 for dataset ${index + 1}`,
        text2: `Text 2 for dataset ${index + 1}`,
        sector: index % 2 === 0 ? "Sector 1" : "Sector 2",
        areaOfResearch: index % 2 === 0 ? "Research Area 1" : "Research Area 2"
    }));

    const [selectedSector, setSelectedSector] = useState("");
    const [selectedAreaOfResearch, setSelectedAreaOfResearch] = useState("");

    const filteredData = dummyData.filter(data => {
        return (
            (selectedSector === "" || data.sector === selectedSector) &&
            (selectedAreaOfResearch === "" || data.areaOfResearch === selectedAreaOfResearch)
        );
    });

    return (
        <div className="page-component overflow-y-scroll dark:bg-slate-800">
            <div className="p-10">
                <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">COREII Datasets</h2>
                <div
                    className="card p-5 bg-slate-400 dark:bg-gray-700 text-gray-800 dark:text-white overflow-hidden align-middle grid grid-cols-10 gap-4"
                    style={{ minHeight: "7rem" }}>
                    <p>Filter</p>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="FILTER BY KEYWORD OR PHRASE"
                            className="input input-bordered input-md dark:bg-gray-700 border-gray-300 rounded-md py-2 p-2 w-3/10"
                        />
                        <select
                            className="p-2 bg-gray-200 dark:bg-gray-950 text-gray-800 dark:text-gray-200 rounded"
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                        >
                            <option value="">FILTER BY SECTOR</option>
                            <option value="Sector 1">Sector 1</option>
                            <option value="Sector 2">Sector 2</option>
                        </select>
                        <select
                            className="p-2 bg-gray-200 dark:bg-gray-950 text-gray-800 dark:text-gray-200 rounded"
                            value={selectedAreaOfResearch}
                            onChange={(e) => setSelectedAreaOfResearch(e.target.value)}
                        >
                            <option value="">AREA OF RESEARCH</option>
                            <option value="Research Area 1">Research Area 1</option>
                            <option value="Research Area 2">Research Area 2</option>
                        </select>
                    </div>

                </div>
            </div>
            <div
                className="flex justify-between items-center p-5 bg-slate-200 dark:bg-gray-800 text-gray-800 dark:text-white">
                <span>{filteredData.length} Results</span>
                <button className="p-2">
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4 p-10">
                {filteredData.map((data, index) => (
                    <CardDatasets key={index}>
                        <h3 className="text-xl font-bold">{data.title}</h3>
                        <p>{data.text1}</p>
                        <p>{data.text2}</p>
                    </CardDatasets>
                ))}
            </div>
        </div>
    );
};

export default PageDatasets;