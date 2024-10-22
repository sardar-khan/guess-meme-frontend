import React from 'react';
import logo from '../../assets/logo.png';
import timeImg from '../../assets/icons/netshell.png';
import dollarbag from '../../assets/icons/dollarbag.png';
import rock from '../../assets/icons/rock.png';
import { Link } from 'react-router-dom';

const TaskBar = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center h-[51px] w-full bg-[#6F48A1] shadow1 z-[1000]'>

            <div className='connectBtn flex items-center w-[275px]'>
                <img src={logo} className='w-[55px] h-[55px]' alt="Logo" />
                <h2 className='SegoeUi'>Connect Wallet</h2>
            </div>

            <div className='flex items-center gap-[9px] h-full w-[calc(100%-415px)] SegoeUi px-3'>
                <Link to='' className='taskActive text-white flex items-center gap-2 w-full max-w-[220px]'>
                    <img src={dollarbag} alt="" />
                    Tokens
                </Link>
                <Link to='' className='taskActiveNot text-white flex items-center gap-2 w-full max-w-[220px]'>
                    <img src={rock} alt="" />
                    Launch Token
                </Link>
                <Link to='' className='taskActiveNot text-white flex items-center gap-2 w-full max-w-[220px]'>
                    {/* <img src={""} alt="" /> */}
                    👁 ️Reveals
                </Link>
            </div>

            <div className='h-full flex items-center gap-[10px] w-[190px]'>
                <span className='SegoeUi font-normal text-white text-[18px]'>EN</span>
                <div className='timeCls h-full w-full flex justify-center items-center gap-2'>
                    <img src={timeImg} alt="" />
                    <span className='SegoeUi font-normal text-white text-[20px]'>3:24 PM</span>
                </div>
            </div>

        </div>
    );
}

export default TaskBar;
