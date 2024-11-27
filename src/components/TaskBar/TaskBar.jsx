import React, { useState, useEffect } from 'react';
import timeImg from '../../assets/icons/netshell.png';
import dollarbag from '../../assets/icons/dollarbag.png';
import rock from '../../assets/icons/rock.png';
import { NavLink } from 'react-router-dom';
import ConnectButton from '../../web3/ConnectButton';

const TaskBar = () => {
    const [currentTime, setCurrentTime] = useState('');

    const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }));
    };

    useEffect(() => {
        updateTime();
        const intervalId = setInterval(updateTime, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const navLinkClass = (isActive) =>
        `overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[150px] ${isActive ? 'taskActive' : 'taskActiveNot'}`;

    return (
        <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center h-[40px] w-full bg-[#6F48A1] shadow1 z-[1000]'>

            <ConnectButton />

            <div className='flex items-center gap-[3px] text-xs h-full w-[calc(100%-200px)] sm:w-[calc(100%-330px)] SegoeUi px-0 sm:px-3'>
                {/* <NavLink to='/' className={({ isActive }) => navLinkClass(isActive)}>
                    <img src={dollarbag} alt="Dollar Bag Icon" />
                    Tokens
                </NavLink> */}

                {/* <NavLink to='/launchToken' className={({ isActive }) => navLinkClass(isActive)}>
                    <img src={rock} alt="Rock Icon" />
                    Launch Token
                </NavLink> */}

                <NavLink to='/revealsBestPerformers' className={({ isActive }) => navLinkClass(isActive)}>
                    👁️ Reveals
                </NavLink>

                {/* <NavLink to='/userprofile' className={({ isActive }) => navLinkClass(isActive)}>
                    User profile
                </NavLink> */}

            </div>

            <div className='h-full flex items-center gap-1 sm:gap-[10px] w-[90px] sm:w-[130px]'>
                <span className='SegoeUi font-normal text-white text-[12px] sm:text-[14px]'>EN</span>
                <div className='timeCls h-full w-full flex justify-center items-center gap-0 sm:gap-1'>
                    <img src={timeImg} className='w-[20px] sm:w-[20px]' alt="Clock Icon" />
                    <span className='SegoeUi font-normal text-white text-[12px] sm:text-[14px]'>{currentTime}</span>
                </div>
            </div>

        </div>
    );
}

export default TaskBar;
