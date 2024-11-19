import React from 'react'
import userprofileImg from '../assets/images/userprofile.png'

const CoinheldCard = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-[80px] h-[80px] border rounded-full flex object-cover overflow-hidden'>
                <img src={userprofileImg} className='' alt="" />
            </div>
            <div className='text-center'>
                <h5 className='PixelOperatorbold text-xl'>5314749 Jorgie</h5>
                <p className='text-base'>64.7336 SOL</p>
                <div className='flex justify-between items-center w-full mt-2'>
                    <p className='text-sm'>Refresh</p>
                    <p className='text-sm'>View Coins</p>
                </div>
            </div>
        </div>
    )
}

export default CoinheldCard