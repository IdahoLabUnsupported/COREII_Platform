import * as React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

//Page Specific Css
import "./role-edit.css";
import DragDropBasic from "../../../elements/drag-drop/DragDropBasic";

type Props = object;

export default function RoleEdit({ props }) {

    function handleFieldChange(key, event) {
        var tempItem = structuredClone(props.currUser);
        tempItem[key] = event.target.value;
        props.setCurrRole(tempItem);
        props.updateRoleFunc(props.currUser);
    }
    function updatePermissions(selectedRoles) {
        // console.log("test");
        // console.log(selectedRoles);
        // var tempItem = structuredClone(props.currUser);
        // tempItem.roles = selectedRoles;
        // props.setCurrUser(tempItem);
        // console.log(props.currUser);
        // props.updateUserFunc(props.currUser);
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
                onClose={() => props.setIsOpen(false)}
            >
                <Dialog.Panel className="admin-edit-container">
                    <Dialog.Title>Edit Role {props.currRole.name}</Dialog.Title>
                    <Dialog.Description className="admin-edit-description">
                        The Selected roles information is below. Please edit and
                        hit save once complete
                    </Dialog.Description>

                    <div className="admin-drag-drop-container">
                        <form
                            className="admin-edit-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="admin-inputs-container">
                                <div className="admin-input">
                                    <div className="admin-input-title">
                                        Role Name
                                    </div>
                                    <input
                                        className="admin-input-text"
                                        type="text"
                                        value={props.currRole.name}
                                        onChange={(e) =>
                                            handleFieldChange("name", e)
                                        }
                                    ></input>
                                </div>
                                {/* <div className="admin-input">
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
                                </div> */}
                            </div>
                            <div className="admin-drag-drop-container">
                                <DragDropBasic
                                    props={{
                                        items: props.permissions,
                                        itemsSelected: props.userPermissions,
                                        updateSelected: updatePermissions,
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
                        <DragDropBasic
                            props={{
                                items: props.permissions,
                                itemsSelected: props.userPermissions.map(
                                    (i) => {
                                        return i.id;
                                    }
                                ),
                            }}
                        ></DragDropBasic>
                    </div>

                    <button onClick={() => props.setIsOpen(false)}>Save</button>
                    <button onClick={() => props.setIsOpen(false)}>
                        Cancel
                    </button>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    );
}
