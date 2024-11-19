import React from 'react'
import userprofileImg from '../assets/images/userprofile.png'

const CoinsCreatedCard = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-[80px] h-[80px] border rounded-full flex object-cover overflow-hidden'>
                <img src={userprofileImg} className='' alt="" />
            </div>
            <div className='text-center'>
                <h5 className='PixelOperatorbold text-base flex items-center justify-center gap-2 mt-2'>Created by <img src={userprofileImg} className='w-4 h-4' alt="" /> 4Ehei4</h5>
                <p className='text-base'>market cap: 19.95k</p>
                <div className='flex justify-between items-center w-full mt-2'>
                    <p className='text-sm'>replies: 669</p>
                    <p className='text-sm'>4 days ago</p>
                </div>
                <h5 className='PixelOperatorbold text-base flex items-center justify-center gap-2 mt-2'>AMZN Corp (ticker: AMZN)</h5>
                <p className='text-xs'>$AMZN WE ALWAYS DELIVER. *Not affiliated with http://Amazon.com, Inc.</p>
            </div>
        </div>
    )
}

export default CoinsCreatedCard