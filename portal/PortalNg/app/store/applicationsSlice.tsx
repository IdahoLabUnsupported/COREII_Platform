// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Application {
    applicationId: number;
    applicationName: string;
    applicationSourceUrl: string;
    textData: string;
    textHelps: string;
    textSummary: string;
    textWorks: string;
    applicationIcon: string;
    applicationNews:string;
    applicationImages?: string[];
  username: string | null;
}
export type AuthStore = {
  username: string | null;
};

export interface ApplicationState { // Use ApplicationState
    applications: Application[];
    username: string | null;
}

const initialState: ApplicationState = {
    applications: [],
    username: null,
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        setApplications(state, action: PayloadAction<Application[]>) {
            state.applications = action.payload;
        },
        updatedeleteApplication(state, action: PayloadAction<number>) {
            state.applications = state.applications.filter(app => app.applicationId !== action.payload);
        },
        uploadApplication(state, action: PayloadAction<Application>) {
            state.applications.push(action.payload);
        },
        setUser(state, action: PayloadAction<AuthStore>) {
            state.username = action.payload.username;
        },
        logoutUser(state) {
            state.username = null;
        },
    },
});

export const { setApplications, updatedeleteApplication, uploadApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;