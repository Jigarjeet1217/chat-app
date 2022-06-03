import React from 'react';
import { createContext } from 'use-context-selector';

export const CurrentRoomContext = createContext();

export const CurrentRoomContextProvider = ({ children, data }) => {
  return (
    <CurrentRoomContext.Provider value={data}>
      {children}
    </CurrentRoomContext.Provider>
  );
};
