import React, { createContext, useState } from "react";

export const AppContext = createContext();

// manages the global state using React Context
// provides the appState and scheduleData states to all children components
// allowing for easy state management across the app
export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({});
  const [scheduleData, setScheduleData] = useState(null);

  return (
    <AppContext.Provider
      value={{ appState, setAppState, scheduleData, setScheduleData }}
    >
      {children}
    </AppContext.Provider>
  );
};
