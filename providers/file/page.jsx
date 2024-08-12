"use client";

import React, { useContext, createContext, useState } from 'react';

// Create a context
export const FileContext = createContext();

// Create a provider component
export default function FileProvider({ children }) {
  const [delFiles, setDelFiles] = useState([]);
  const [upFiles, setUpFiles] = useState([]);

  const updateUpFiles = (files) => {
    setUpFiles(files)
  }
  
  const updateDelFiles = (files) => {
    setDelFiles(files)
  }

  return (
    <FileContext.Provider value={{ upFiles, updateUpFiles, delFiles, updateDelFiles }}>
      {children}
    </FileContext.Provider>
  );
}