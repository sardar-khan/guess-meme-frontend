import React from 'react'
import img from '../assets/images/Group 159.png'

const Notifications = ({notification}) => {
    return (
        <div className='flex flex-row items-center justify-start'>
            <div className='w-[60px] h-[60px] border rounded-full flex justify-center items-center object-cover overflow-hidden'>
                <img src={img} className='' alt="" />
            </div>
            <div className='text-center ml-2'>
                <h5 className='text-left PixelOperatorbold text-base mt-1'>ssss</h5>
                <p className='text-left text-base'>{notification?.message}</p>
            </div>
        </div>
    )
}

export default Notifications