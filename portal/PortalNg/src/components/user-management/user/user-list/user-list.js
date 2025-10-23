var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
//Custom Components
import UserEdit from "../edit-user/user-edit";
//Page Specific Css
import "./user-list.css";
var userModel = /** @class */ (function () {
    function userModel() {
        this.key = 0;
        this.firstName = "Not Set";
        this.email = "";
        this.dateCreated = new Date();
        this.roles = new Array();
        this.permissions = new Array();
        this.active = true;
    }
    return userModel;
}());
export { userModel };
var roles = [
    { id: 1, name: "Admin", permissions: [1, 2, 3, 4, 5, 6] },
    { id: 2, name: "User Manager", permissions: [2, 3] },
    { id: 3, name: "Optic User", permissions: [5, 6] },
    { id: 4, name: "New Hire", permissions: [6] },
    { id: 5, name: "Data Entry", permissions: [5] },
    { id: 6, name: "Tool Specialist", permissions: [5] },
    { id: 7, name: "Database Manager", permissions: [5] },
    { id: 8, name: "IT Specialist", permissions: [5] },
    { id: 9, name: "Test Role", permissions: [5] },
    { id: 10, name: "New Role", permissions: [] },
];
var names = ["Dylan", "Stephan", "Jason", "Lili", "Bob", "Greg", "John"];
var users = [];
var i = __spreadArray([], Array(names.length), true).map(function (_, i) {
    var newUser = new userModel();
    newUser.key = i;
    var nameIndex = Math.floor(Math.random() * names.length);
    newUser.firstName = names[nameIndex];
    newUser.dateCreated.setDate(newUser.dateCreated.getDate() - Math.floor(Math.random() * 1000));
    __spreadArray([], Array(roles.length), true).map(function (_, roleId) {
        if (Math.round(Math.random()) === 0)
            newUser.roles.push(roleId);
    });
    names.splice(nameIndex, 1);
    newUser.email = newUser.firstName + "@inl.gov";
    users.push(newUser);
});
var UserList = function () {
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var _b = useState(new userModel()), getCurrUser = _b[0], setCurrUser = _b[1];
    var _c = useState(users), getUsers = _c[0], setUsers = _c[1];
    // var i = FetchData("https://localhost:7086/api/userRole/users");
    fetch("https://localhost:7086/api/userRole/users")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        setUsers(data);
    })
        .catch(function (err) { return console.log("Error: ".concat(err)); });
    function updateUser(user) {
        var updatedUsers = structuredClone(getUsers);
        setUsers(
        //@ts-ignore
        getUsers.map(function (a) {
            if (a.key !== user.key) {
                return a;
            }
            else {
                return user;
            }
        }));
    }
    function setDialog() {
        setIsOpen(function () { return !isOpen; });
    }
    function setUser(user) {
        setCurrUser(function () { return user; });
    }
    return (_jsxs("div", { className: "admin-list dark:bg-slate-800", children: [_jsx(UserEdit, { props: {
                    roles: roles,
                    userRoles: getCurrUser.roles,
                    isOpen: isOpen,
                    setIsOpen: setIsOpen,
                    currUser: getCurrUser,
                    setCurrUser: setCurrUser,
                    updateUserFunc: updateUser,
                } }), _jsx("div", { className: "admin-list-title text-4xl mb-8 text-gray-800 dark:text-white", children: _jsx("h2", { children: "User Management" }) }), _jsxs("div", { className: "admin-list-body", children: [_jsx("div", { className: "admin-list-description", children: "This is the user management page. A list of all users is displayed below. Select one to edit the users information." }), _jsx("div", { className: "admin-list-table-container  bg-slate-400 dark:bg-slate-800 dark:text-white text-dark", children: _jsxs("ul", { className: "admin-list-table", children: [_jsxs("li", { className: "admin-table-row admin-table-headers", children: [_jsx("div", { className: "user-row-name", children: "Name" }), _jsx("div", { className: "user-row-email", children: "Email" }), _jsx("div", { className: "user-row-date-created", children: "Date Created" }), _jsx("div", { className: "user-row-role-count", children: "Roles" })] }), getUsers.map(function (i) {
                                    return (_jsxs("li", { onClick: function (event) {
                                            setCurrUser(i);
                                            setDialog();
                                        }, className: "admin-table-row admin-table-row-selectable", children: [_jsxs("div", { className: "user-row-name", children: [i.firstName, " ", i.lastName] }), _jsx("div", { className: "user-row-email", children: i.email }), _jsx("div", { className: "user-row-date-created" }), _jsx("div", { className: "user-row-role-count", children: i.roles.length })] }));
                                })] }) })] })] }));
};
export default UserList;
