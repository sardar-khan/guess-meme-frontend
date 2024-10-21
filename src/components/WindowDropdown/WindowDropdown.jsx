import React, { useState, useRef, useEffect } from 'react';
import './WindowDropdown.css';

const WindowDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="win2000-select-container">
            <select id="win2000-select" className="win2000-select">
                <option value="option1">Ethereum</option>
                <option value="option2">Solana</option>
            </select>
        </div>

    );
}

export default WindowDropdown