import React from 'react'
import rocket from '../assets/icons/rocket.png'
import minimize from '../assets/icons/minimize.png'
import maximize from '../assets/icons/maximize.png'
import cross from '../assets/icons/cross.png'
import folder from '../assets/icons/Group 110.png'

const LaunchTokens = () => {
    return (
        <div className='border flex justify-center items-center py-[55px] px-4 w-full '>

            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>

                <div className='flex items-center justify-between gap-1 px-4 py-1 primary-bg'>
                    <div className='flex items-center gap-1'>
                        <img src={rocket} alt="" />
                        <span className='PixelOperator text-white text-[31px] !font-normal'>Launch Token</span>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <img src={minimize} alt="" />
                        <img src={maximize} alt="" />
                        <img src={cross} alt="" />
                    </div>
                </div>

                <div className='secondary-bg p-[14px]'>

                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='flex flex-col  gap-9 p-[30px]'>

                                <div className='flex gap-2'>
                                    <span className='flex items-center gap-4'>
                                        <label htmlFor="" className='formLabel min-w-[150px] text-right'>Name:</label>

                                        <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                            <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                <input type="text" name="" id="" className='w-full px-2 py-3' />
                                            </div>
                                        </div>

                                    </span>
                                    <span className='flex items-center gap-6'>
                                        <label htmlFor="" className='formLabel min-w-[150px] text-right'>Ticker:</label>

                                        <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                            <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                <input type="text" name="" id="" className='w-full px-2 py-3' />
                                            </div>
                                        </div>

                                    </span>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Image:</label>

                                    <img src={folder} alt="" />

                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Description:</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Supply:</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Website<br />(Optional):</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Telegram<br />(Optional):</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="" className='formLabel min-w-[150px] text-right'>Twitter<br />(Optional):</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>

                                <div className='flex gap-2'>
                                    <span className='flex items-center gap-4'>
                                        <label htmlFor="" className='formLabel min-w-[150px] text-right'>Initial Buy:</label>

                                        <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                            <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                <input type="text" name="" id="" className='w-full px-2 py-3' />
                                            </div>
                                        </div>

                                    </span>
                                    <span className='flex items-center gap-6'>
                                        <label htmlFor="" className='formLabel min-w-[150px] text-right'>RevealTime:</label>

                                        <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                            <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                <input type="text" name="" id="" className='w-full px-2 py-3' />
                                            </div>
                                        </div>

                                    </span>
                                </div>

                                <div className='pl-[166px]'>
                                    <button className='themeBtn SegoeUi w-fit'><span>Launch Token</span></button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LaunchTokens