// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from "react";
import ReactDOM from "react-dom";
import ButtonBasic1 from "../elements/ButtonBasic1";
import ButtonIcon from "../elements/ButtonIcon";

interface DeleteModalProps {
    isOpen: boolean;
    title?: string; // Optional, default: "Confirm Delete"
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

const NewsDeleteModal: React.FC<DeleteModalProps> = ({
                                                     isOpen,
                                                     title = "Confirm Delete",
message,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
          >
          <div
    className="modal-container bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-1/3 shadow-lg relative max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
>
<ButtonIcon
    label="close"
          buttonIcon="close"
          color="btn-ghost"
          buttonSize="btn-sm"
          className="absolute top-2 right-2"
          onClick={onClose}
    />
    <h3 className="text-xl mb-4">{title}</h3>
    <p className="mb-4">{message}</p>
    <div className="modal-action flex justify-end">
<ButtonBasic1 label="Delete" color="btn-primary" onClick={onConfirm} />
    <ButtonBasic1 label="Cancel" color="btn-secondary" onClick={onClose} />
</div>
</div>
</div>,
    document.body
);
};

export default NewsDeleteModal;