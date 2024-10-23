import React from 'react';
import logo from '../../assets/logo.png';
import timeImg from '../../assets/icons/netshell.png';
import dollarbag from '../../assets/icons/dollarbag.png';
import rock from '../../assets/icons/rock.png';
import { Link, NavLink } from 'react-router-dom';

const TaskBar = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center h-[50px] w-full bg-[#6F48A1] shadow1 z-[1000]'>

            <div className='connectBtn flex items-center w-[275px]'>
                <img src={logo} className='w-[55px] h-[55px]' alt="Logo" />
                <h2 className='SegoeUi'>Connect Wallet</h2>
            </div>

            <div className='flex items-center gap-[3px] h-full w-[calc(100%-200px)] sm:w-[calc(100%-415px)] SegoeUi px-0 sm:px-3'>
                <NavLink
                    to='/'
                    className={({ isActive }) =>
                        isActive
                            ? 'taskActive overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                            : 'taskActiveNot overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                    }>
                    <img src={dollarbag} alt="Dollar Bag Icon" />
                    Tokens
                </NavLink>

                <NavLink
                    to='/launchToken'
                    className={({ isActive }) =>
                        isActive
                            ? 'taskActive overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                            : 'taskActiveNot overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                    }>
                    <img src={rock} alt="Rock Icon" />
                    Launch Token
                </NavLink>

                <NavLink
                    to='/revealsBestPerformers'
                    className={({ isActive }) =>
                        isActive
                            ? 'taskActive overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                            : 'taskActiveNot overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full max-w-[220px]'
                    }>
                    👁 ️Reveals
                </NavLink>
            </div>

            <div className='h-full flex items-center gap-1 sm:gap-[10px] w-[90px] sm:w-[190px]'>
                <span className='SegoeUi font-normal text-white text-[12px] sm:text-[18px]'>EN</span>
                <div className='timeCls h-full w-full flex justify-center items-center gap-0 sm:gap-2'>
                    <img src={timeImg} className='w-[20px] sm:w-auto' alt="Clock Icon" />
                    <span className='SegoeUi font-normal text-white text-[12px] sm:text-[20px]'>3:24 PM</span>
                </div>
            </div>

        </div>
    );
}

export default TaskBar;
