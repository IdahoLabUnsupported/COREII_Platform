import * as React from "react";
import "./user-list.css";
export declare class userModel {
    key: number;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: Date;
    roles: Array<number>;
    permissions: Array<any>;
    active: boolean;
    constructor();
}
type Props = object;
declare const UserList: React.FC<Props>;
export default UserList;
