import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchCoins } from '../features/coinSlice';

import group160 from '../assets/images/group160.webp';
import herologo from '../assets/images/Group 159.png';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = () => {
        dispatch(searchCoins(searchQuery));
    };

    const progress = 71;
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className='py-8 px-2 pb-0 md:px-4 flex flex-col items-center'>
            <h1 className='text-center text-[#C720EF] text-[20px] leading-[22px] md:text-[30px] md:leading-[32px] font-extrabold tracking-[2px]'
                style={{
                    textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                }}>
                Guess <br /> Master
            </h1>

            <div className='relative flex flex-col justify-center items-center w-full max-w-[516px] mt-[10px] p-4 pb-2 rounded-2xl' style={{ backgroundImage: `url(${group160})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                <div className="absolute top-0 right-0">
                    <svg
                        height={100}
                        width={100}
                        className="transform -rotate-90"
                    >
                        <circle
                            stroke="#39393980"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke="#FB4EFF"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                    </svg>
                    <div className="PixelOperatorbold absolute inset-0 flex items-center justify-center text-[#FFF9F9] text-xl font-bold">
                        {progress}
                    </div>
                </div>

                <div className='w-[55px] h-[55px] bg-[#D680FF] rounded-2xl'>
                    <img src={herologo} alt="" />
                </div>

                <div className='flex items-center gap-4'>
                    <span className='PixelOperator lightWhite text-[18px]'>Guess</span>
                    <span className='PixelOperator bg-[#FFF9F9] w-[4px] h-[4px] rounded-full'></span>
                    <span className='PixelOperator lightWhite text-[18px]'>$GUESS</span>
                </div>

                <span className='PixelOperator lightWhite text-[18px]'>Marketcap</span>
                <span className='PixelOperator text-[#FDA6FF] text-[22px]'>$16,221.07</span>
            </div>

            <div className='flex items-center justify-center gap-1 w-full max-w-[516px]'>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    placeholder='Search'
                    className='text-center p-[5px] mt-2 w-full border-[4px] border-[#efefef] border-l-[#4C4C4C] border-t-[#C0C0C0]'
                />
                <button
                    onClick={handleSearch}
                    className={`themeBtn w-fit min-w-fit text-[12px] h-full text-white px-4 py-2 mt-1`}
                >
                    <span className='!text-[12px]'>Search</span>
                </button>
            </div>

        </div>
    );
}

export default Hero;
