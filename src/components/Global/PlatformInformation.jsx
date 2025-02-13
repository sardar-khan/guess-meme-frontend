import React from 'react'
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
const PlatformInformation = () => {
    return (
        <div className='flex items-center p-2 gap-2 text-xl'>
            <FaXTwitter />
            <FaInstagram />
            <FaTiktok />
            <FaTelegramPlane />
        </div>
    )
}

export default PlatformInformation
