import React, { useEffect, useState } from 'react';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import logo from '../assets/logo.png';
import burger from '../assets/icons/burger.png';
import userprofile from '../assets/images/userprofile.png';
import img from '../assets/images/Group 159.png'

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DirectBuy from './DirectBuy';
import ConnectButton from '../web3/ConnectButton';

const Navbar = () => {
    const isOn = useSelector((state) => state.animation.isOn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    const openDirectModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false)
    };


    return (
        <div className='px-1 sm:px-2 primary-bg'>
            <div className='flex items-center justify-between px-0 py-2'>
                {/* Logo Section */}
                <div className='flex items-end gap-3'>
                    <Link to='/' className='flex items-center'>
                        <img src={logo} className='w-[40px] sm:w-[30px] mt-[-4px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[28px]'>Guess.Meme</h2>
                    </Link>

                    <div className='flex items-center gap-1'>

                        <div class={`${isOn ? 'element-to-shake' : ''} PixelOperatorbold flex items-center gap-1 p-2 text-sm font-semibold rounded bg-white max-[930px]:hidden`}>
                            <img src={img} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">+mnO</Link>
                            Buy
                            <Link class="hover:underline" href="/">23 SOl</Link>
                            of climber
                            <img src={img} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>
                        <div class={`${isOn ? 'element-to-shake' : ''} PixelOperatorbold flex items-center gap-1 p-2 text-sm font-semibold rounded text-white bg-[#5F16BC] max-[930px]:hidden`}>
                            <img src={img} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">GhSAMy</Link>

                            <Link class="hover:underline" href="/">created Melony</Link>
                            on 07/03/24
                            <img src={img} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>

                    </div>

                </div>

                {/* Hamburger Icon for Mobile */}
                <div className='lg:hidden'>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        <img src={burger} alt="" />
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className='hidden lg:flex gap-2 relative z-[999]'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn w-[120px] min-w-[120px] !text-xs uppercase'>
                        <span className='PixelOperatorbold '>Launch Token</span>
                    </Link>
                    {/* <Link to='/editprofile' className='themeBtn w-[35px] min-w-[50px] uppercase'>
                        <span className='mt-[-8px]'>⚡</span>
                    </Link> */}
                    <button
                        className='themeBtn w-[35px] min-w-[50px] uppercase'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className='mt-[-8px]'>⚡</span>
                    </button>


                    <Link to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                        <span className='PixelOperatorbold'>?</span>
                    </Link>

                    <ConnectButton />
                </div>
            </div>

            {/* Sidebar Menu for Mobile */}
            <div className={`lg:hidden fixed top-0 left-0 w-[260px] h-full bg-[#1a1a1a] z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className='flex justify-between items-center p-4'>
                    <Link to='/' className='flex items-center' onClick={closeMenu}>
                        <img src={logo} className='w-[30px] mb-[-8px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[22px] mt-[10px]'>Guess.Meme</h2>
                    </Link>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        &times;
                    </button>
                </div>
                <div className='flex flex-col gap-4 p-4'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn text-xs uppercase' onClick={closeMenu}>
                        <span className='PixelOperatorbold'>Launch Token</span>
                    </Link>

                    <ConnectButton />
                    <div className='flex gap-2'>
                        <div
                            className='themeBtn w-[35px] min-w-[50px] uppercase'
                            onClick={openDirectModal}
                        >
                            <span className='mt-[-8px]'>⚡</span>
                        </div>
                        <Link onClick={() => setIsMenuOpen(false)} to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                            <span className='PixelOperatorbold'>?</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Background Overlay when Menu is Open */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40"
                    onClick={closeMenu}
                ></div>
            )}
            <DirectBuy
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Navbar;
