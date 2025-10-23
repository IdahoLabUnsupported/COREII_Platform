// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { createSlice, configureStore } from '@reduxjs/toolkit';
import applicationsReducer, { ApplicationState } from './applicationsSlice'; // Import ApplicationState

const initialState = {
  openDrawerLeft: false,
  openDrawerLeftWidth: 64,
  selectedInvestigation: null,
}

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    // App functions
    toggleDrawer: (state) => {
      const store = state;
      store.openDrawerLeft = !store.openDrawerLeft;
    },
    setDrawerLeftWidth: (state, action) => {
      const store = state;
      store.openDrawerLeftWidth = action.payload;
    },
    setSelectedInvestigation: (state, action) => {
      const store = state;
      // store.selectedInvestigation = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    applications: applicationsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware();
  },
});

export const appStateActions = appStateSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;