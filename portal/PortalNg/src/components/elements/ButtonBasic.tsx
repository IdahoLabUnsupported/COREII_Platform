// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
    link: {
        title: string;
        location?: string;
    };
    color: string;
    additionalClass?: string;
    onClick?: () => void;
};

const ButtonBasic1: React.FC<Props> = ({
    link,
    color,
    additionalClass = "",
    onClick,
}) => {
    return (
        // <>
        //     {/* Render link if location */}
        //     {link.location && (
        //         <Link
        //             className={`
        //     btn
        //     ${color}
        //     hover:bg-sky-800
        //     text-white
        //     hover:opacity-100
        //     border-none
        //     ${additionalClass}
        //   `}
        //             to={link.location}
        //         >
        //             {link.title}
        //         </Link>
        //     )}

        //     {/* Render button if function */}
        //     {onClick && (
        //         <button
        //             className={`
        //     btn
        //     ${color}
        //     hover:bg-sky-800
        //     text-white
        //     hover:opacity-100
        //     border-none
        //     ${additionalClass}
        //   `}
        //             onClick={onClick}
        //         >
        //             {link.title}
        //         </button>
        //     )}
        // </>
        <>
        {/* Render link if location */}
        {link.location && 
          <Link
            className={`
              btn
              ${color}
              text-white
              hover:opacity-100
              border-none
              ${additionalClass}
            `}
            to={link.location}
          >
            {link.title}
          </Link>
        }
  
        {/* Render button if function */}
        {onClick &&
          <button
            className={`
              btn
              ${color}
              text-white
              hover:opacity-100
              border-none
              ${additionalClass}
            `}
            onClick={onClick}
          >
            {link.title}
          </button>
        }
      </>
    );
};

export default ButtonBasic1;
