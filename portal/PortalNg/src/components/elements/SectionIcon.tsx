// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// src/components/elements/SectionIcon.tsx
import React from 'react';

interface SectionIconProps {
    /**
     * Icon name
     */
    icon: string;
    /**
     * Background color
     */
    bgColor?: string;
    /**
     * Text color
     */
    textColor?: string;
    /**
     * Additional class names
     */
    className?: string;
    /**
     * Text to display
     */
    text?: string;
    /**
     * Click handler
     */
    onClick?: () => void;
}

const SectionIcon: React.FC<SectionIconProps> = ({ icon, bgColor = 'bg-slate-400 dark:bg-gray-700', textColor = 'text-gray-800 dark:text-white', text, className, onClick}) => {
    const iconClass = `${bgColor} ${textColor} rounded-t-lg h-20 flex flex-col items-center justify-center cursor-pointer  ${className}`;

    return (
        <div className={iconClass} onClick={onClick}>
            <span className="material-icons text-xs">{icon}</span>
            {text && <span className="mt-2 uppercase text-center text-xs">{text}</span>}
        </div>
    );
};

export default SectionIcon;