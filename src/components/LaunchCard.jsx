import React from 'react'
import CardImg from '../assets/images/card 1.png'

const LaunchCard = ({ setSpace }) => {
    return (
        <div className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
            <div className='absolute top-0 left-0 h-full w-[5px] bg-white'></div>
            <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[8px] bg-[#7D73BF]'></div>
            <div className='absolute bottom-0 right-0 w-[99.2%] h-[5px] bg-[#7D73BF]'></div>
            <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
            <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

            <div className='secondary-bg w-full max-w-[620px] border-[3px] border-l-[15px] border-t-[8px] border-r-[15px] border-b-[15px] border-[#A49DD2]'>

                <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>
                    <div className={`flex ${setSpace === 'medium' ? 'p-[5px]' : 'p-[10px]'} w-full justify-between gap-1 border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff0] border-r-[#fff0]`}>

                        <div className={`${setSpace === 'medium' ? 'w-[40%]' : 'w-[30%]'} min-h-full border-2`}>
                            <img src={CardImg} className='min-h-full w-full' alt="" />
                        </div>

                        <div className={`relative bg-white ${setSpace === 'medium' ? 'w-[60%]' : 'w-[70%]'} min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}>
                            <div className={`${setSpace === 'medium' ? 'p-[8px]' : 'p-[15px]'} min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}>
                                <h5>Created by 💩 POOPSY_DEV</h5>
                                <h5 className='text-[#D9223E]'>Marketcap: 8.97K</h5>
                                <div>
                                    <div className='flex justify-between w-full mt-[15px]'>
                                        <h5>Progress:</h5>
                                        <h5 className='text-[13px]'>11% to Uniswap</h5>
                                    </div>

                                    <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1 after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div>
                                </div>

                                <div>
                                    <div className='flex justify-between w-full mt-[15px]'>
                                        <h5>Trust Score:</h5>
                                    </div>

                                    <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1 after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div>

                                    <div className='flex justify-end items-end w-full'>
                                        <h5 className='text-[13px] mt-1'>70/100</h5>
                                    </div>

                                    <p className='text-black PixelOperator mt-3 text-[16px] leading-[13px]'>POOPSY (ticker: POOPSY): Lorem ipsum dolor sit amet, consectetur </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default LaunchCard