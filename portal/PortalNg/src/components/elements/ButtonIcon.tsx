// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * What is the icon?
   */
  buttonIcon: string;
  /**
   * What is the icon size?
   */
  buttonSize?: string | undefined;
  /**
   * What is the background color? Use classes.
   */
  color: 'btn-primary' | 'btn-secondary' | 'btn-neutral' | 'btn-ghost' | string;
  /**
   * Optional link
   */
  link?: string;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * Additional class names
   */
  className?: string;
}

const ButtonIcon: React.FC<ButtonProps> = ({ label, buttonIcon, buttonSize, color, link, onClick ,className}) => {
  // Define base classes
  const baseClasses = `btn btn-circle ${color} ${buttonSize} uppercase hover:opacity-100 border-transparent`;

  // Define conditional light mode classes
  const lightModeClasses = color === 'btn-secondary' ? 'border border-solid !border-primary text-primary hover:text-primary' : '';
  const btnGhostLightModeClasses = color === 'btn-ghost' ? 'text-primary hover:text-primary ' : '';

  // Define conditional dark mode classes
  const darkModeClasses = color === 'btn-secondary' ? 'dark:border dark:border-solid dark:!border-gray-400 dark:text-gray-300 dark:hover:text-white' : '';
  const btnGhostDarkModeClasses = color === 'btn-ghost' ? 'dark:text-primary dark:hover:text-primary' : '';

  // Combine base classes and conditional classes
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${btnGhostLightModeClasses} ${btnGhostDarkModeClasses} ${className}`;

  return (
      <>
        {link ? (
            <Link className={btnClass} to={link} title={label}>
          <span className="material-icons">
            {buttonIcon}
          </span>
            </Link>
        ) : (
            <button className={btnClass} onClick={onClick} title={label}>
              <span className="sr-only">{label}</span>
              <span className="material-icons">
            {buttonIcon}
          </span>
            </button>
        )}
      </>
  );
};

export default ButtonIcon;
