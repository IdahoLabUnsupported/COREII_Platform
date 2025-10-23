// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ButtonBasic1 from "./ButtonBasic1";

import "./elements.css";

type ModalTriggerButtonProps = {
    buttonLabel: string;
    modalTitle: string;
    imageSrc: string;
    buttonStyle: React.CSSProperties;
    mini: boolean;
    classNames?:string;
};

const ModalTriggerButton: React.FC<ModalTriggerButtonProps> = ({
    buttonLabel,
    modalTitle,
    imageSrc,
    buttonStyle,
    mini = false,
    classNames,
}) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            {!mini ? (
                <Button
                    className={'col-4 ' + classNames}
                    style={buttonStyle }
                    onClick={handleShow}
                >
                    <strong>
                        {buttonLabel} {mini}
                    </strong>
                </Button>
            ) : (
                <div
                    style={buttonStyle}
                    className={'mini-trigger-button ' + classNames}
                    onClick={handleShow}
                >
                    <span>
                        {buttonLabel} {mini}
                    </span>
                </div>
            )}

            {show && (
                <div className="modal modal-open">
                    <div
                        className="modal-box dark:bg-gray-800  bg-white text-black  dark:bg-dark dark:text-white"
                       
                    >
                        <label
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={handleClose}
                        >
                            ✕
                        </label>
                        <h3 className="text-lg font-bold">{modalTitle}</h3>
                        <p>
                            <img
                                src={imageSrc}
                                alt={modalTitle}
                                className="img-fluid"
                            />
                        </p>
                        <div className="modal-action">
                            <ButtonBasic1 label="Close" color="btn-secondary" onClick={handleClose}
                            />

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalTriggerButton;
