import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
//Custom Components
import RoleEdit from "../edit-role/role-edit";
//Page Specific Css
import "./role-list.css";
import "./../../user-management-styling.css";
var permissionModel = /** @class */ (function () {
    function permissionModel() {
    }
    return permissionModel;
}());
export { permissionModel };
var roleModel = /** @class */ (function () {
    function roleModel() {
        this.id = 0;
        this.name = "Not Set";
        this.dateCreated = new Date();
        this.permissions = new Array();
        this.active = true;
        this.userAssignedCount = 0;
    }
    return roleModel;
}());
export { roleModel };
var permissions = [
    {
        id: 1,
        name: "EditUser",
        description: "Ability to add and edit existing users",
    },
    {
        id: 2,
        name: "RemoveUser",
        description: "Ability to remove existing users",
    },
    {
        id: 3,
        name: "EditRole",
        description: "Ability to add and edit existing roles",
    },
    {
        id: 4,
        name: "RemoveRole",
        description: "Ability to remove existing roles",
    },
    {
        id: 5,
        name: "Optic View",
        description: "Ability to view the optic application",
    },
    {
        id: 6,
        name: "Optic Edit",
        description: "Ability to edit the optic application",
    },
    {
        id: 7,
        name: "Application X Edit",
        description: "Ability to edit the application X",
    },
    {
        id: 8,
        name: "Application X View",
        description: "Ability to view the application X",
    },
    {
        id: 9,
        name: "Application Y Edit",
        description: "Ability to edit the application Y",
    },
    {
        id: 10,
        name: "Application Y View",
        description: "Ability to view the application Y",
    },
    {
        id: 11,
        name: "Application Z Edit",
        description: "Ability to edit the application Z",
    },
    {
        id: 12,
        name: "Application Z View",
        description: "Ability to view the application Z",
    },
];
function getRandomPermissions() {
    var newPermissions = Array();
    permissions.forEach(function (element) {
        if (Math.round(Math.random()) > 0) {
            newPermissions.push(element);
        }
    });
    return newPermissions;
}
var roles = [
    {
        id: 1,
        name: "Admin",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 2,
        name: "UserManager",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 3,
        name: "OpticUser",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 4,
        name: "NewHire",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 5,
        name: "DataEntry",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 6,
        name: "ToolSpecialist",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 7,
        name: "DatabaseManager",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 8,
        name: "ITSpecialist",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 9,
        name: "TestRole",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
    {
        id: 10,
        name: "NewRole",
        dateCreated: new Date(),
        permissions: getRandomPermissions(),
        active: true,
        userAssignedCount: 3,
    },
];
var RoleList = function () {
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var _b = useState(new roleModel()), getCurrRole = _b[0], setCurrRole = _b[1];
    function setDialog() {
        setIsOpen(function () { return !isOpen; });
    }
    function setRole(role) {
        setCurrRole(function () { return role; });
    }
    return (_jsxs("div", { className: "admin-list dark:bg-slate-800", children: [_jsx(RoleEdit, { props: {
                    permissions: permissions,
                    userPermissions: getCurrRole.permissions,
                    isOpen: isOpen,
                    setIsOpen: setIsOpen,
                    currRole: getCurrRole,
                } }), _jsx("div", { className: "admin-list-title text-4xl mb-8 text-gray-800 dark:text-white", children: _jsx("h2", { children: "Role Management" }) }), _jsxs("div", { className: "admin-list-body dark:bg-gray-800 text-black  dark:text-white", children: [_jsx("div", { className: "admin-list-description", children: "This is the role management page. A list of all roles is displayed below. Select one to edit the roles information." }), _jsx("div", { className: "admin-list-table-container  bg-slate-400 dark:dark:bg-gray-800", children: _jsxs("ul", { className: "admin-list-table", children: [_jsxs("li", { className: "admin-table-row admin-table-headers", children: [_jsx("div", { className: "role-row-name", children: "Name" }), _jsx("div", { className: "role-row-date-created", children: "Date Created" }), _jsx("div", { className: "role-row-permission-count", children: "Permissions" })] }), roles.map(function (i) {
                                    return (_jsxs("li", { onClick: function (event) {
                                            setCurrRole(i);
                                            setDialog();
                                        }, className: "admin-table-row admin-table-row-selectable", children: [_jsx("div", { className: "role-row-name", children: i.name }), _jsx("div", { className: "role-row-date-created", children: i.dateCreated.toLocaleDateString("en-US") }), _jsx("div", { className: "role-row-permission-count", children: i.permissions.length })] }));
                                })] }) })] })] }));
};
export default RoleList;
