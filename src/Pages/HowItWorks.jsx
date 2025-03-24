import React from 'react'
import minimize from '../assets/icons/minimize.png'
import maximize from '../assets/icons/maximize.png'
import cross from '../assets/icons/cross.png'
import comingSoon from '../assets/images/comingSoon.png'
import BoxHeader from '../components/Global/BoxHeader'
import { Link } from 'react-router-dom'

const HowItWorks = () => {

    return (
        <div className='Robtronika absolute min-h-[100dvh] z-[999] top-0 left-0 flex justify-center items-center py-[200px] px-4 w-full bg-[#00000080]'>

            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>

                <BoxHeader label='How it Works' />

                <div className='secondary-bg p-[14px]'>

                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='w-full flex flex-col justify-center p-2 sm:p-8'>

                                <p className='PixelOperatorbold text-base md:text-[21px]'>Guess is all about pure speculation, having fun and fair launches without the worry of rug pulls.</p>
                                <p className='PixelOperatorbold text-base md:text-[21px]'>There’s no presale and no team allocations.</p>
                                <ul>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'
                                    >Step1: <br />Take a lucky guess.</li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>Step2: <br />Buy the coin you believe it may be before the reveal time is up or wait until reveal time is up before purchasing.</li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>
                                        Step3: <br />Sell your guess before reveal time or after reveal time depending on when you wish!</li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>Step4: <br />If enough users make the same guess and the marketcap hits $70k the coin will be listed on the necessary platform depending on which chain like Uniswap for ETH or Raydium for SOL.
                                    </li>



                                </ul>
                                <p className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'> Aside from the
                                    fees all liquidity will be burnt and locked in for all users to trade.</p>
                                <ul>

                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'> Understanding the reveal time: <br />
                                    </li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>
                                    All tokens launched on Guess have a reveal time this is the period of time most of the data will be hidden until the reveal time is up.
                                    </li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>
                                    This strategy has been implemented to give all users a fair shot of purchasing a coin with just a pure guess.
                                    </li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>
                                    Upon reveal time being hit all the information surrounding the token will become visible. 
                                    </li>
                                    <li className='PixelOperatorbold text-base md:text-[21px] text-bold mt-5'>
                                    The only time the reveal time will be hit before the set timer is in the event a coin has reached bonding.
                                    </li>

                                </ul>
                                <Link to={'/'}> <button className='themeBtn PixelOperatorbold w-fit py-4 px-7 mt-8 md:mx-auto'><span>Happy guessing!</span></button></Link>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HowItWorks



