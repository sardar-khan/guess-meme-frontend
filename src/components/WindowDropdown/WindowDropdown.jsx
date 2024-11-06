import React, { useState, useRef, useEffect } from 'react';
import './WindowDropdown.css';
import ethImg from '../../assets/icons/eth.svg';
import solImg from '../../assets/icons/sol.svg';

const WindowDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Solana');
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="win2000-select-container" ref={dropdownRef}>
            <div className="win2000-select" onClick={toggleDropdown}>
                <img
                    src={selectedOption === 'Solana' ? solImg : ethImg}
                    alt={selectedOption}
                    className="dropdown-icon"
                />
                <span>{selectedOption}</span>
            </div>
            {isOpen && (
                <div className="win2000-dropdown-options">
                    <div
                        className="win2000-option"
                        onClick={() => selectOption('Solana')}
                    >
                        <img src={solImg} alt="Solana" className="dropdown-icon" />
                        Solana
                    </div>
                    <div
                        className="win2000-option"
                        onClick={() => selectOption('Ethereum')}
                    >
                        <img src={ethImg} alt="Ethereum" className="dropdown-icon" />
                        Ethereum
                    </div>
                </div>
            )}
        </div>
    );
}

export default WindowDropdown;
