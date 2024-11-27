import React, { useEffect, useState } from 'react'
import LaunchCard from './LaunchCard'
import { topThreeCoins } from '../utils/api';

const BestPerformance = () => {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        const fetchTopThreeCoins = async () => {
            try {
                const data = await topThreeCoins();
                console.log('Top Three Coins:', data);
                setCoins(data);
            } catch (error) {
                console.error('Error fetching top three coins:', error);
            }
        };

        fetchTopThreeCoins();
    }, []);

    return (
        <div className='p-2 pt-10 md:p-10 pb-0'>
            <h2 className=''>Best Performance</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-5'>
                <div className='relative pt-12 h-fit' >
                    <div className='PixelOperator text-[28px] text-white flex justify-center items-center absolute min-w-[52px] min-h-[32px] top-0 right-0 bg-[#6F48A1]'>#1</div>
                    <LaunchCard setSpace="medium" />
                </div>
                <div className='relative pt-12 mt-[60px] h-fit'>
                    <div className='PixelOperator text-[28px] text-white flex justify-center items-center absolute min-w-[52px] min-h-[32px] top-0 right-0 bg-[#6F48A1]'>#2</div>
                    <LaunchCard setSpace="medium" />
                </div>
                <div className='relative pt-12 mt-[120px] h-fit'>
                    <div className='PixelOperator text-[28px] text-white flex justify-center items-center absolute min-w-[52px] min-h-[32px] top-0 right-0 bg-[#6F48A1]'>#3</div>
                    <LaunchCard setSpace="medium" />
                </div>
            </div>
        </div>
    )
}

export default BestPerformance