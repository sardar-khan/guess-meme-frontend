// 1. First, install the required package
// npm install darkreader

// 2. Create a new context for dark mode in src/context/DarkModeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { enable as enableDarkMode, disable as disableDarkMode, setFetchMethod } from 'darkreader';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true' || false;
    });

    useEffect(() => {
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDarkMode);

        // Apply dark mode settings
        if (isDarkMode) {
            enableDarkMode({
                brightness: 100,
                contrast: 100,
                sepia: 40,
                grayscale: 0,
                darkSchemeBackgroundColor: '#161A25', // Match your toast background color
            });
        } else {
            disableDarkMode();
        }
    }, [isDarkMode]);

    // Fix for fetch method
    useEffect(() => {
        setFetchMethod(window.fetch);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export const useDarkMode = () => useContext(DarkModeContext);