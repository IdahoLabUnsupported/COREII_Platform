import * as React from "react";
import { useState } from "react";

//Custom Components
import RoleEdit from "../edit-role/role-edit";

//Page Specific Css
import "./role-list.css";
import "./../../user-management-styling.css";

export class permissionModel {
    id: number;
    name: string;
    description: string;
}

export class roleModel {
    id: number;
    name: string;
    dateCreated: Date;
    permissions: Array<permissionModel>;
    active: boolean;
    userAssignedCount: number;

    constructor() {
        this.id = 0;
        this.name = "Not Set";
        this.dateCreated = new Date();
        this.permissions = new Array();
        this.active = true;
        this.userAssignedCount = 0;
    }
}

const permissions = [
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

type Props = object;

function getRandomPermissions() {
    var newPermissions = Array<permissionModel>();
    permissions.forEach((element) => {
        if (Math.round(Math.random()) > 0) {
            newPermissions.push(element);
        }
    });
    return newPermissions;
}
const roles = [
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

const RoleList: React.FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [getCurrRole, setCurrRole] = useState<roleModel>(new roleModel());
  
    function setDialog() {
        setIsOpen(() => !isOpen);
    }

    function setRole(role) {
        setCurrRole(() => role);
    }

    return (
        <div className="admin-list dark:bg-slate-800">
            <RoleEdit
                props={{
                    permissions: permissions,
                    userPermissions: getCurrRole.permissions,
                    isOpen: isOpen,
                    setIsOpen: setIsOpen,
                    currRole: getCurrRole,
                }}
            ></RoleEdit>
            <div className="admin-list-title text-4xl mb-8 text-gray-800 dark:text-white">
                <h2>Role Management</h2>
            </div>
            <div className="admin-list-body dark:bg-gray-800 text-black  dark:text-white">
                <div className="admin-list-description">
                    This is the role management page. A list of all roles is
                    displayed below. Select one to edit the roles information.
                </div>
                <div className="admin-list-table-container  bg-slate-400 dark:dark:bg-gray-800">
                    <ul className="admin-list-table">
                        <li className="admin-table-row admin-table-headers">
                            <div className="role-row-name">Name</div>
                            <div className="role-row-date-created">
                                Date Created
                            </div>
                            <div className="role-row-permission-count">
                                Permissions
                            </div>
                        </li>
                        {roles.map((i) => {
                            return (
                                <li
                                    onClick={function (event) {
                                        setCurrRole(i);
                                        setDialog();
                                    }}
                                    className="admin-table-row admin-table-row-selectable"
                                >
                                    <div className="role-row-name">
                                        {i.name}
                                    </div>
                                    <div className="role-row-date-created">
                                        {i.dateCreated.toLocaleDateString(
                                            "en-US"
                                        )}
                                    </div>
                                    <div className="role-row-permission-count">
                                        {i.permissions.length}
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

export default RoleList;
