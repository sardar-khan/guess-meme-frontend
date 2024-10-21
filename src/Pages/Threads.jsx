import React from 'react'
import Arrowback from '../assets/icons/Arrowback.svg'
import { Link } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom/ChatRoom'

const Threads = () => {
    return (
        <div className='p-10'>

            <Link to='' className='flex items-center gap-2'>
                <img src={Arrowback} alt="" />
                <span className='Inter text-[#515151] font-normal text-xs'>GO BACK</span>
            </Link>

            <div className='flex justify-between gap-2'>
                <div className='w-[72%] mt-10'>
                    <ChatRoom />
                </div>
                <div className='w-[28%]'>
                    Trades
                </div>
            </div>

        </div>
    )
}

export default Threads