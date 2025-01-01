import React, { useState, useRef, useEffect } from "react";
import "./WindowDropdown.css";
import ethImg from "../../assets/icons/eth.svg";
import solImg from "../../assets/icons/sol.svg";
import polImg from "../../assets/icons/polygon.png";
import bnbImg from "../../assets/icons/bnb.png";
import { useNavigate } from "react-router-dom";

const WindowDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const blockChain = localStorage.getItem("blockchain")
  const [selectedOption, setSelectedOption] = useState(blockChain === null ? localStorage.setItem("blockchain", "SOL") : blockChain);

  const dropdownRef = useRef(null);
  console.log("selectedOption", selectedOption)


  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    localStorage.setItem("blockchain", option);
    setIsOpen(false);
    navigate('/')
    window.location.reload(); // Refresh the page
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="win2000-select-container" ref={dropdownRef}>
      <div className="win2000-select" onClick={toggleDropdown}>
        <img
          src={selectedOption === "SOL" ? solImg : ethImg}
          alt={selectedOption}
          className="dropdown-icon"
        />
        <span>{selectedOption}</span>
      </div>
      {isOpen && (
        <div className="win2000-dropdown-options">
          <div className="win2000-option" onClick={() => selectOption("SOL")}>
            <img src={solImg} alt="SOL" className="dropdown-icon" />
            SOL
          </div>
          <div className="win2000-option" onClick={() => selectOption("ETH")}>
            <img src={ethImg} alt="ETH" className="dropdown-icon" />
            ETH
          </div>
          <div className="win2000-option" onClick={() => selectOption("POL")}>
            <img src={polImg} alt="ETH" className="dropdown-icon" />
            POL
          </div>
          <div className="win2000-option" onClick={() => selectOption("BNB")}>
            <img src={bnbImg} alt="ETH" className="dropdown-icon" />
            BNB
          </div>
        </div>
      )}
    </div>
  );
};

export default WindowDropdown;
