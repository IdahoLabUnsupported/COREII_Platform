import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
//Page Specific Css
import "./role-edit.css";
import DragDropBasic from "../../../elements/drag-drop/DragDropBasic";
export default function RoleEdit(_a) {
    var props = _a.props;
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
    return (_jsx(Transition, { show: props.isOpen, enter: "transition translate ease duration-800 transform", enterFrom: "opacity-0 translate-x-full", enterTo: "opacity-100 translate-x-0", leave: "transition translate ease duration-800 transform", leaveFrom: "translate-x-0", leaveTo: "translate-x-full", as: Fragment, children: _jsx(Dialog, { className: "admin-detail-edit", open: props.isOpen, onClose: function () { return props.setIsOpen(false); }, children: _jsxs(Dialog.Panel, { className: "admin-edit-container", children: [_jsxs(Dialog.Title, { children: ["Edit Role ", props.currRole.name] }), _jsx(Dialog.Description, { className: "admin-edit-description", children: "The Selected roles information is below. Please edit and hit save once complete" }), _jsxs("div", { className: "admin-drag-drop-container", children: [_jsxs("form", { className: "admin-edit-form", onSubmit: handleSubmit, children: [_jsx("div", { className: "admin-inputs-container", children: _jsxs("div", { className: "admin-input", children: [_jsx("div", { className: "admin-input-title", children: "Role Name" }), _jsx("input", { className: "admin-input-text", type: "text", value: props.currRole.name, onChange: function (e) {
                                                        return handleFieldChange("name", e);
                                                    } })] }) }), _jsx("div", { className: "admin-drag-drop-container", children: _jsx(DragDropBasic, { props: {
                                                items: props.permissions,
                                                itemsSelected: props.userPermissions,
                                                updateSelected: updatePermissions,
                                            } }) }), _jsxs("div", { className: "admin-edit-buttons", children: [_jsx("button", { onClick: handleSubmit, children: "Save" }), _jsx("button", { onClick: function () { return props.setIsOpen(false); }, children: "Cancel" })] })] }), _jsx(DragDropBasic, { props: {
                                    items: props.permissions,
                                    itemsSelected: props.userPermissions.map(function (i) {
                                        return i.id;
                                    }),
                                } })] }), _jsx("button", { onClick: function () { return props.setIsOpen(false); }, children: "Save" }), _jsx("button", { onClick: function () { return props.setIsOpen(false); }, children: "Cancel" })] }) }) }));
}
