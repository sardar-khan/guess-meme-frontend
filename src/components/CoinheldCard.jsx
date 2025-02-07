import React from 'react'
import userprofileImg from '../assets/images/userprofile.png'
import { Link } from 'react-router-dom'

const CoinheldCard = ({ coinHeld }) => {
    console.log("coinHeld", coinHeld)
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-[80px] h-[80px] border rounded-full flex object-cover overflow-hidden'>
                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinHeld?.image}`} className='' alt="" />
            </div>
            <div className='text-center'>
                <h5 className='PixelOperatorbold text-xl'>{coinHeld?.name}</h5>
                <p className='text-base'>64.7336 SOL</p>
                <div className='flex justify-between items-center gap-10 w-full mt-2'>
                 
                    <Link to={`/trade/${coinHeld?.coinId}/${coinHeld?.token_address}`} className='text-sm PixelOperator hover:underline'>View Coin</Link>
                </div>
            </div>
        </div>
    )
}

export default CoinheldCard