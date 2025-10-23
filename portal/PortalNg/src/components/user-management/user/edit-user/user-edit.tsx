import * as React from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

//Page Specific Css
import "./user-edit.css";
import DragDropBasic from "../../../elements/drag-drop/DragDropBasic";

type Props = object;

export default function UserEdit({ props }) {
    function handleFieldChange(key, event) {
        var tempItem = structuredClone(props.currUser);
        tempItem[key] = event.target.value;
        props.setCurrUser(tempItem);
        props.updateUserFunc(props.currUser);
    }
    function updateRoles(selectedRoles) {
        var tempItem = structuredClone(props.currUser);
        tempItem.roles = selectedRoles;
        props.setCurrUser(tempItem);
        props.updateUserFunc(props.currUser);
    }
    function handleSubmit(event) {
        props.updateUserFunc(props.currUser);
        props.setIsOpen(false);
    }

    return (
        <Transition
            show={props.isOpen}
            enter="transition translate ease duration-800 transform"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition translate ease duration-800 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
            as={Fragment}
        >
            <Dialog
                className="admin-detail-edit"
                open={props.isOpen}
                onClose={() => props.setIsOpen(true)}
            >
                <Dialog.Panel className="admin-edit-container">
                    <Dialog.Title>Edit User {props.currUser.name}</Dialog.Title>
                    <Dialog.Description className="admin-edit-description">
                        The Selected users information is below. Please edit and
                        hit save once complete
                    </Dialog.Description>
                    <form className="admin-edit-form" onSubmit={handleSubmit}>
                        <div className="admin-inputs-container">
                            <div className="admin-input">
                                <div className="admin-input-title">
                                    User Name
                                </div>
                                <input
                                    className="admin-input-text"
                                    type="text"
                                    value={props.currUser.name}
                                    onChange={(e) =>
                                        handleFieldChange("name", e)
                                    }
                                ></input>
                            </div>
                            <div className="admin-input">
                                <div className="admin-input-title">
                                    User Email
                                </div>
                                <input
                                    className="admin-input-text"
                                    type="text"
                                    value={props.currUser.email}
                                    onChange={(e) =>
                                        handleFieldChange("email", e)
                                    }
                                ></input>
                            </div>
                        </div>
                        <div className="admin-drag-drop-container">
                            <DragDropBasic
                                props={{
                                    items: props.roles,
                                    itemsSelected: props.userRoles,
                                    updateSelected: updateRoles,
                                }}
                            ></DragDropBasic>
                        </div>
                        <div className="admin-edit-buttons">
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={() => props.setIsOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    );
}
