import React from 'react'
import img from '../assets/images/Group 159.png'
import { NavLink } from 'react-router-dom'

const Notifications = ({ notification }) => {
    console.log("notification",notification)
    return (
        <div className='flex flex-row items-center justify-start'>
            <div className='w-[60px] h-[60px] border rounded-full flex justify-center items-center object-cover overflow-hidden'>
                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${notification?.user_profile}`} className='' alt="" />
            </div>
           <div className='text-center ml-2'>
           <NavLink to={`/profile/${notification?.newThread?.user_id}`}>
                <p className='text-left text-base'>{notification?.message}</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Notifications;