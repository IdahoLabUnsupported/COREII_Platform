// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    /**
     * Button contents
     */
    label: string;
    /**
     * What is the background color? Use classes.
     */
    color?: 'btn-primary' | 'btn-primary-inactive' | 'btn-secondary' | 'btn-ghost';
    /**
     * What is the button size?
     */
    buttonSize?: string;
    /**
     * Optional link
     */
    link?: string;
    /**
     * Optional click handler
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    /**
     * Optional additional classes
     */
    additionalClasses?: string;
    /**
     * Optional
     */
    target?: string;
}

const ButtonBasic1: React.FC<ButtonProps> = ({ label, color, buttonSize, link, onClick, additionalClasses,target }) => {
    // Define base classes
    const baseClasses = `btn ${color} ${buttonSize} uppercase hover:opacity-100 border-none`;

    // Define conditional light mode classes
    const lightModeClasses = color === 'btn-secondary' ? '!border !border-solid !border-primary text-primary' : '';

    // Define conditional dark mode classes
    const darkModeClasses = color === 'btn-secondary' ? 'dark:border dark:border-solid dark:!border-gray-400 dark:text-gray-300' : '';

    // Define custom text color and hover text color classes for btn-ghost
    const customTextColorClasses = color === 'btn-ghost'
        ? 'text-primary hover:text-primary'
        : color === 'btn-primary' || color === 'btn-primary-inactive'
            ? 'hover:text-white dark:hover:text-white'
            : 'hover:text-primary dark:hover:text-current';

    // Combine base classes and conditional classes
    const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${customTextColorClasses} ${additionalClasses}`;

    return (
        <>
            {link ? (
                target ? (
                    <a className={btnClass} href={link} target={target} rel="noopener noreferrer">
                        {label}
                    </a>
                ) : (
                    <Link className={btnClass} to={link}>
                        {label}
                    </Link>
                )
            ) : (
                <button className={btnClass} onClick={onClick}>
                    {label}
                </button>
            )}
        </>
    );
};

export default ButtonBasic1;
