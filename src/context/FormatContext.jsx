import React, { createContext, useState, useContext } from "react";

const FormatContext = createContext();

export const FormatProvider = ({ children }) => {
  const [format, setFormatState] = useState(() => {
    // Try to get saved format from localStorage
    const savedFormat = localStorage.getItem("plexFormat");
    return savedFormat || "subtitle - progress% (title)";
  });

  // Update localStorage when format changes
  const setFormat = (newFormat) => {
    setFormatState(newFormat);
    localStorage.setItem("plexFormat", newFormat);
  };

  return (
    <FormatContext.Provider value={{ format, setFormat }}>
      {children}
    </FormatContext.Provider>
  );
};

export const useFormat = () => {
  const context = useContext(FormatContext);
  if (!context) {
    throw new Error("useFormat must be used within a FormatProvider");
  }
  return context;
};
