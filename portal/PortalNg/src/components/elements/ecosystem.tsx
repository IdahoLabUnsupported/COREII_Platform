// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from "react";

const images = [
    {
        id: 1,
        src: "/red-onyx.png",
        title: "Red Onyx",
        text: "Scalable Cyber-Physical Testing",
        details: "1. Hands-on testing and validation of security solutions in realistic environments\n2. Improved understanding of system vulnerabilities and resilience",
        color: "#DC2626"
    },
    {
        id: 2,
        src: "/orange-onyx.png",
        title: "Orange Onyx",
        text: "Workforce Alignment",
        details: "1. Access to workforce trends and skill gap analysis\n2. Development of targeted training and recruitment programs",
        color: "#F97316"
    },
    {
        id: 3,
        src: "/yellow-onyx.png",
        title: "Yellow Onyx",
        text: "Knowledge Management & Transfer",
        details: "1. Access to a centralized repository of research findings and best practices\n2. Facilitation of knowledge sharing and collaboration",
        color: "#EAB308"
    },
    {
        id: 4,
        src: "/green-onyx.png",
        title: "Green Onyx",
        text: "Sponsor Research Alignment",
        details: "1. Clear understanding of sponsor priorities and expectations\n2. Ability to align research projects with sponsor goals",
        color: "#16A34A"
    },
    {
        id: 5,
        src: "/blue-onyx.png",
        title: "Blue Onyx",
        text: "Threat Analysis & Mitigation",
        details: "1. Access to up-to-date threat intelligence and mitigation techniques\n2. Enhanced capability to develop and test new defenses",
        color: "#2563EB"
    },
    {
        id: 6,
        src: "/purple-onyx.png",
        title: "Purple Onyx",
        text: "Market & Supply Chain Analysis",
        details: "1. Comprehensive analysis of supply chain risks and market conditions\n2. Identification of potential weak points in supply chains",
        color: "#7C3AED"
    }
];

const Ecosystem: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full p-6">
            {/* First Row: Centered Image */}
            <div className="w-48 h-48  flex justify-center mb-8 relative group transition-all duration-300 hover:scale-110">
                <img
                    src={import.meta.env.BASE_URL + "/white-onyx.png"}
                    alt="Featured"
                    className="w-48 h-48 object-cover rounded-lg "
                />
                <p className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold uppercase">CORE
                    II</p>
                <div className="rounded-lg bg-gray-100 dark:bg-gray-900 absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-bold">Main Mission :</h3>
            <p className="text-sm mt-1 whitespace-pre-line">
                Decision
            <br />
                Inteligence
            <br />
                Research
        </p>
</div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full mx-auto">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 hover:text-primary group"
                    >
                        <div className="relative w-full flex flex-col items-center h-60">
                            <img
                                src={import.meta.env.BASE_URL + image.src}
                                alt={image.title}
                                className="w-24 h-24 object-cover rounded-lg transition-all duration-300"
                            />
                            <div className="flex items-center w-full max-w-full mt-2 h-100">
                                <div className="h-10 w-1 mr-2" style={{ backgroundColor: image.color }}></div>
                                <div className="text-lg text-gray-800 dark:text-white">{image.text}</div>
                            </div>
                        </div>
                        {/* Hover Details */}
                        <div
                            className="p-4 bg-gray-100 dark:bg-gray-900 absolute top-0 left-0 w-full h-full bg-black/80 text-white flex flex-col items-center justify-center text-left  rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:h-full">
                            <h3 className="text-lg font-bold text-center">{image.title}</h3>
                            <p className="text-sm mt-1 whitespace-pre-line text-left">{image.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ecosystem;