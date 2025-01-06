import React from 'react'

const Footer = () => {
    return (
        <div className='pb-[70px] justify-center sm:flex sm:justify-between items-center space-x-2 px-3'>
            <div className=''>
                <p className='Inter text-[14px] text-[#616161] text-center'>© guess.meme 2025</p>
            </div>
            <div className='flex justify-center items-center space-x-2 ml-0 sm:!ml-[-130px]'>
                <p className='Inter text-[14px] text-[#616161]'>privacy policy</p>
                <p className='Inter text-[14px] text-[#616161]'>|</p>
                <p className='Inter text-[14px] text-[#616161]'>terms of service</p>
            </div>
            <div></div>
        </div>
    )
}

export default Footer