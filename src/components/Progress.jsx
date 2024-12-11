import React from 'react'

const Progress = ({ progress }) => {
    return (
        <div>
            <div className='flex justify-between items-end w-full mt-[7px] md:mt-[15px]'>
                {/* <h5 className='PixelOperatorbold text-[16px] md:text-[15px]'>Progress:</h5> */}
                <h2 className='mb-[8px] text-[12px] md:!text-[20px]'>bonding curve progress: {progress}%</h2>
            </div>

            <div className='relative overflow-hidden bg-[#c5c5c5] h-[20px]'>
                <div
                    className='absolute bg-[#15C570] h-full '
                    style={{ width: `${progress || 0}%` }}
                ></div>
            </div>
        </div>
    )
}

export default Progress