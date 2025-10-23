import * as React from "react";
import { useState } from "react";

//Custom Components
import UserEdit from "../edit-user/user-edit";

//Page Specific Css
import "./user-list.css";

export class userModel {
    key: number;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: Date;
    roles: Array<number>;
    permissions: Array<any>;
    active: boolean;

    constructor() {
        this.key = 0;
        this.firstName = "Not Set";
        this.email = "";
        this.dateCreated = new Date();
        this.roles = new Array<number>();
        this.permissions = new Array();
        this.active = true;
    }
}

type Props = object;

const roles = [
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

const names = ["Dylan", "Stephan", "Jason", "Lili", "Bob", "Greg", "John"];

var users: Array<any> = [];
var i = [...Array(names.length)].map((_, i) => {
    var newUser = new userModel();
    newUser.key = i;
    var nameIndex = Math.floor(Math.random() * names.length);
    newUser.firstName = names[nameIndex];
    newUser.dateCreated.setDate(
        newUser.dateCreated.getDate() - Math.floor(Math.random() * 1000)
    );
    [...Array(roles.length)].map((_, roleId) => {
        if (Math.round(Math.random()) === 0) newUser.roles.push(roleId);
    });
    names.splice(nameIndex, 1);
    newUser.email = newUser.firstName + "@inl.gov";
    users.push(newUser);
});

const UserList: React.FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [getCurrUser, setCurrUser] = useState<userModel>(new userModel());
    const [getUsers, setUsers] = useState<Array<userModel>>(users);

    // var i = FetchData("https://localhost:7086/api/userRole/users");

    fetch("https://localhost:7086/api/userRole/users")
        .then((res) => res.json())
        .then((data) => {
            setUsers(data);
        })
        .catch((err) => console.log(`Error: ${err}`));

    function updateUser(user: userModel) {
        var updatedUsers = structuredClone(getUsers);
        setUsers(
            //@ts-ignore
            getUsers.map((a) => {
                if (a.key !== user.key) {
                    return a;
                } else {
                    return user;
                }
            })
        );
    }
    function setDialog() {
        setIsOpen(() => !isOpen);
    }

    function setUser(user) {
        setCurrUser(() => user);
    }

    return (
        <div className="admin-list dark:bg-slate-800">
            <UserEdit
                props={{
                    roles: roles,
                    userRoles: getCurrUser.roles,
                    isOpen: isOpen,
                    setIsOpen: setIsOpen,
                    currUser: getCurrUser,
                    setCurrUser: setCurrUser,
                    updateUserFunc: updateUser,
                }}
            ></UserEdit>
            <div className="admin-list-title text-4xl mb-8 text-gray-800 dark:text-white">
                <h2>User Management</h2>
            </div>
            <div className="admin-list-body">
                <div className="admin-list-description">
                    This is the user management page. A list of all users is
                    displayed below. Select one to edit the users information.
                </div>
                <div className="admin-list-table-container  bg-slate-400 dark:bg-slate-800 dark:text-white text-dark">
                    <ul className="admin-list-table">
                        <li className="admin-table-row admin-table-headers">
                            <div className="user-row-name">Name</div>
                            <div className="user-row-email">Email</div>
                            <div className="user-row-date-created">
                                Date Created
                            </div>
                            <div className="user-row-role-count">Roles</div>
                        </li>
                        {getUsers.map((i) => {
                            return (
                                <li
                                    onClick={function (event) {
                                        setCurrUser(i);
                                        setDialog();
                                    }}
                                    className="admin-table-row admin-table-row-selectable"
                                >
                                    <div className="user-row-name">
                                        {i.firstName} {i.lastName}
                                    </div>
                                    <div className="user-row-email">
                                        {i.email}
                                    </div>
                                    <div className="user-row-date-created">
                                        {/* {i.dateCreated.toLocaleDateString(
                                            "en-US"
                                        )} */}
                                    </div>
                                    <div className="user-row-role-count">
                                        {i.roles.length}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserList;
