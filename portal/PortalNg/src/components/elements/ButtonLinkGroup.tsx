// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useLayoutEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonBasic from './ButtonBasic';

type ButtonProps = {
  baseRoute?: string;
  actions?: Array<{
    label: string;
    link?: string;
  }>;
  buttonSize?: string;
  stepper?: boolean;
};

const ButtonLinkGroup: React.FC<ButtonProps> = ({ baseRoute = '', actions, buttonSize, stepper = false }) => {
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [buttonWidths, setButtonWidths] = useState<number[]>([]);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const fullPath = location.pathname;
    const index = actions.findIndex(action => fullPath.endsWith(action.link));
    setSelectedButton(index !== -1 ? index : null);
  }, [location, actions]);

  useLayoutEffect(() => {
    // Calculate the widths of the buttons
    const widths = buttonRefs.current.map(ref => ref?.offsetWidth || 0);

    setButtonWidths(widths); // Update to set adjusted widths
  }, [actions.length]);

  const getClipPathStyle = (index: number) => {
    const width = buttonWidths[index] || 0;

    if (!stepper || width === 0) return {};

    const arrowWidth = 25; // Width of the arrow in pixels

    if (index === 0) {
      return {
        clipPath: `polygon(0% 0%, ${width - arrowWidth}px 0%, ${width}px 50%, ${width - arrowWidth}px 100%, 0% 100%)`,
      };
    }
    if (index === actions.length - 1) {
      return {
        clipPath: `polygon(0% 0%, ${width}px 0%, ${width}px 100%, 0% 100%, ${arrowWidth}px 50%)`,
      };
    }
    return {
      clipPath: `polygon(0% 0%, ${width - arrowWidth}px 0%, ${width}px 50%, ${width - arrowWidth}px 100%, 0% 100%, ${arrowWidth}px 50%)`,
    };
  };

  return (
      <div className="join gap-0.5">
        {actions.map((action, index) => {
          const isMatch = selectedButton === index;
          const color = isMatch ? 'btn-primary' : 'btn-primary-inactive';
          const additionalClasses = isMatch ? '' : '';
          const clipPathStyle = getClipPathStyle(index);

          return (
              <div
                  key={index}
                  ref={el => (buttonRefs.current[index] = el)}
                  style={{ display: 'inline-block', ...clipPathStyle }}
                  className={`${stepper && index !== 0 ? '-ml-[25.5px]' : ''}`}
              >
              {/*  <ButtonBasic*/}
              {/*      label={action.label}*/}
              {/*      link={`${baseRoute}/${action.link}`}*/}
              {/*      color={color}*/}
              {/*      buttonSize={buttonSize}*/}
              {/*      additionalClasses={`*/}
              {/*  join-item*/}
              {/*  ${additionalClasses}*/}
              {/*  ${stepper && (index >= 0 && index < actions.length - 1) ? '!pr-7' : ''}*/}
              {/*  ${stepper && (index > 0 || index > actions.length - 1) ? '!pl-9' : ''}*/}
              {/*`}*/}
              {/*      style={clipPathStyle}*/}
              {/*  />*/}
              </div>
          );
        })}
      </div>
  );
};

export default ButtonLinkGroup;
