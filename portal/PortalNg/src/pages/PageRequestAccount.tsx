// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as React from "react";

type Props = object;

const PageRequestAccount: React.FC<Props> = () => {
    return (
        <>
            <div className="flex flex-col items-center w-full dark:bg-gray-900 dark:text-white pt-8 bg-white text-black min-h-screen">
                <h1 className="text-center mb-8 mt-8 pt-8">Request Account</h1>
                <div className="dark:bg-gray-800 w-1/3 bg-gray-200 p-8 mt-4 rounded-md">
                    <form>
                        <div className="flex flex-col mb-4 mt-8">
                            <div className="flex items-center mb-4 mt-4">
                                <label htmlFor="firstName" className="w-1/4 text-right mr-4">First Name</label>
                                <input type="text" id="firstName" className="input  input-md  dark:bg-gray-700 rounded-md px-3 py-2 w-3/4" />
                            </div>
                            <div className="flex items-center mb-4 mt-4">
                                <label htmlFor="lastName" className="w-1/4 text-right mr-4">Last Name</label>
                                <input type="text" id="lastName" className="input input-md  dark:bg-gray-700 rounded-md px-3 py-2 w-3/4" />
                            </div>
                            <div className="flex items-center mb-4 mt-4">
                                <label htmlFor="email" className="w-1/4 text-right mr-4">Email</label>
                                <input type="email" id="email" className="input input-md dark:bg-gray-700  rounded-md px-3 py-2 w-3/4" />
                            </div>
                            <div className="flex items-center mb-4 mt-4">
                                <label htmlFor="organization" className="w-1/4 text-right  mr-4">Organization</label>
                                <input type="text" id="organization" className="input  input-md dark:bg-gray-700 rounded-md px-3 py-2 w-3/4" />
                            </div>
                            <div className="flex items-center mb-4 mt-4">
                                <label htmlFor="role" className="w-1/4 text-right mr-4">Role</label>
                                <select id="role" className="dark:bg-gray-700  input   rounded-md px-3 py-2 w-3/4  bg-gray-100">
                                    <option value="">Select your role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                            <div className="flex items-center mt-6 mb-4 justify-end pl-3">
                                <button type="submit" className="bg-primary hover:bg-sky-800 hover:opacity-100 border-none text-white px-3 py-2 rounded-md w-3/4 text-sm font-bold">Submit Request</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PageRequestAccount;