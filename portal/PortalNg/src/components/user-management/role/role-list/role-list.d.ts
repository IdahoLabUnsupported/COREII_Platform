import * as React from "react";
import "./role-list.css";
import "./../../user-management-styling.css";
export declare class permissionModel {
    id: number;
    name: string;
    description: string;
}
export declare class roleModel {
    id: number;
    name: string;
    dateCreated: Date;
    permissions: Array<permissionModel>;
    active: boolean;
    userAssignedCount: number;
    constructor();
}
type Props = object;
declare const RoleList: React.FC<Props>;
export default RoleList;
