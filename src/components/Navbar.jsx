import React from 'react'
import WindowDropdown from './WindowDropdown/WindowDropdown'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='px-5 primary-bg'>
            <div className='flex items-center justify-between p-2'>
                {/* <img src={logo} alt="" /> */}
                <Link to='/' className='flex items-center'>
                    <img src={logo} className='mb-[-8px]' alt="" />
                    <h2 className='PixelOperatorbold text-white font-extrabold text-[28px] mt-[10px]'>Guess.Meme</h2>
                </Link>
                <div className='flex gap-2'>
                    <WindowDropdown />
                    <button className='themeBtn uppercase '><span>Mega</span></button>
                    <Link to='/launchToken' className='themeBtn text-xs uppercase'><span className='PixelOperatorbold'>Launch Token</span></Link>
                    <button className='themeBtn w-[35px] min-w-[50px] uppercase '><span className='mt-[-8px]'>⚡</span></button>
                    <button className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'><span className='PixelOperatorbold'>?</span></button>
                </div>
            </div>
        </div>
    )
}

export default Navbar