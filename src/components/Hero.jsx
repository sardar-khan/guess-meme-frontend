import React from 'react'
import group160 from '../assets/images/group160.webp';
import herologo from '../assets/images/Group 159.png';
import LaunchCard from './LaunchCard';

const Hero = () => {
    return (
        <div className='py-8 px-2 md:px-4 flex flex-col items-center'>
            {/* <h1 className='text-center text-[#986AE8] text-6xl font-extrabold'>Guess <br /> Master</h1> */}
            <h1 className='text-center text-[#C720EF] text-[30px] leading-[30px] md:text-[45px] md:leading-[50px] font-extrabold '
                style={{
                    textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                }}>
                Guess <br /> Master
            </h1>

            <div className='flex flex-col justify-center items-center w-full max-w-[516px] mt-[18px] p-4 rounded-2xl' style={{ backgroundImage: `url(${group160})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                <div className='w-[105px] h-[105px] bg-[#D680FF] rounded-2xl'>
                    <img src={herologo} alt="" />
                </div>

                <div className='flex items-center gap-4'>
                    <span className='PixelOperator lightWhite text-[21px]'>Guess</span>
                    <span className='PixelOperator bg-[#FFF9F9] w-[4px] h-[4px] rounded-full'></span>
                    <span className='PixelOperator lightWhite text-[21px]'>$GUESS</span>
                </div>

                <span className='PixelOperator lightWhite text-[21px]'>Marketcap</span>
                <span className='PixelOperator text-[#FDA6FF] text-[25px]'>$16,221.07</span>


            </div>

            <input type="text" placeholder='Search' className='text-center p-2 mt-3 w-full max-w-[516px] border-[4px] border-[#efefef] border-l-[#4C4C4C] border-t-[#C0C0C0]' />

            <LaunchCard />


        </div>
    )
}

export default Hero