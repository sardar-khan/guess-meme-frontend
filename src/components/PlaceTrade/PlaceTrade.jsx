import React, { useState } from 'react'
import ethImg from '../../assets/icons/eth.png'
import solImg from '../../assets/icons/sol.webp'

const PlaceTrade = () => {

    const [showSOGs, setShowSOGs] = useState(false)

    const handleSwitchClick = () => {
        setShowSOGs(!showSOGs)
    }
    return (
        <div className='border flex justify-center items-center w-full '>

            <div className='relative w-full border-t-[1px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <div className='secondary-bg p-[14px]'>

                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='w-full flex flex-col pb-4 pt-2'>

                                <div className='rounded'>
                                    <div className='flex gap-1 px-3'>
                                        <button className='text-[16px] SegoeUi text-[#fff] font-normal text-left bg-[#7539F4] SegoeUi w-full px-3 py-2 rounded'>
                                            Buy
                                        </button>
                                        <button className='text-[16px] SegoeUi text-[#fff] font-normal text-left bg-[#5F16BC] SegoeUi w-full px-2 py-1 rounded'>
                                            Sell
                                        </button>
                                    </div>

                                    <div className='flex justify-between gap-3 px-3 pt-[35px]'>
                                        <span
                                            className='SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer'
                                            onClick={handleSwitchClick}
                                        >
                                            {showSOGs ? 'switch to 646464' : 'switch to SOL'}
                                        </span>
                                        <span className='SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer'>
                                            Set max slippage
                                        </span>
                                    </div>

                                    <div className='flex justify-between gap-3 px-3 pt-[15px]'>
                                        {!showSOGs && (
                                            <div className='w-full Inter'>
                                                <div className='w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                                    <div className=' flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                        <input type="number" name="" id="" className='w-full px-2 py-3 pr-4' />
                                                        <div className='w-fit flex items-center gap-1 bg-white'>
                                                            <span className='text-black font-semibold text-sm SegoeUi'>
                                                                SOL
                                                            </span>
                                                            <img
                                                                src={solImg}
                                                                className='w-[30px] mr-5'
                                                                alt=''
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex justify-between items-center gap-[3px] mt-3'>
                                                    <span className='whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                                        reset
                                                    </span>
                                                    <span className='whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                                        0.1 SOL
                                                    </span>
                                                    <span className='whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                                        0.5 SOL
                                                    </span>
                                                    <span className='whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                                        1 SOL
                                                    </span>
                                                    <span className='whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                                        5 SOL
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {showSOGs && (
                                            <div className='w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                                <div className=' flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                    <input type="text" name="" id="" className='w-full px-2 py-3 pr-4' />
                                                    <div className='w-fit flex items-center gap-1 bg-white'>
                                                        <span className='text-black font-semibold text-sm SegoeUi'>
                                                            ETH
                                                        </span>
                                                        <img
                                                            src={ethImg}
                                                            className='w-[30px] mr-5'
                                                            alt=''
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                </div>

                                <button className='themeBtn Inter w-fit mt-5 mx-auto'><span>Place Trade</span></button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceTrade