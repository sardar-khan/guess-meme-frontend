import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchCoins } from '../features/coinSlice';

import group160 from '../assets/images/group160.webp';
import herologo from '../assets/images/Group 159.png';
import { KingOfTheHill } from '../utils/api';
import { calculateBondingCurveProgress, marketCapCalSOl } from './PlaceTrade/solanaBuySellFunction';
import PlatformInformation from './Global/PlatformInformation';
import { Link } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { calculateEthBondingCurveProgress, getUniswapMarketCap, marketCapCalEth } from './PlaceTrade/ether-trade-utils';
import { getRaydiumMarketCap } from '../web3/market-cap';
import { useWalletContext } from '../context/WalletContext';
import { formatNumber } from '../utils/helper';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const [kingOfHill, setKingOfHill] = useState();
    const [marketCap, setMarketCap] = useState({
            loading: false,
            data: "null"
        })
          const { block_chain, solInUsd, ethInUsd } = useWalletContext()
    const [progressCurveBond, setProgressCurveBond] = useState(0);
    // Fetch KingOfTheHill data on component mount
console.log("project-killer",progressCurveBond)
    console.log("kingOfHill", kingOfHill)

    useEffect(() => {
        const fetchKingOfTheHill = async () => {
            try {
                KingOfTheHill().then((res) => {
                    if (res.status === 200) {
                        setKingOfHill(res?.data)
                       
                    }
                });

            } catch (error) {
                console.error('Error fetching KingOfTheHill data:', error);
            }
        };

        fetchKingOfTheHill();
    }, []);


     const bondingProgressSol = async (token_address) => {
            try {
                const response = await calculateBondingCurveProgress(token_address, true);
    
                setProgressCurveBond(response?.bondingCurveProgress);
            } catch (error) {
                console.error('Error Progress_curve_bond:', error);
                //  toast.error('Failed to Progress_curve_bond.');
            }
        };
        const bondingProgressEth = async (token_address) => {
            try {
                const response = await calculateEthBondingCurveProgress(token_address, true);
    
    
                setProgressCurveBond(response?.bondingCurveProgress);
            } catch (error) {
                console.error('Error Progress_curve_bond:', error);
                //  toast.error('Failed to Progress_curve_bond.');
            }
        };
    useEffect(() => {
        if (!kingOfHill?.kingOfTheHill?.token_address) return

        if (!kingOfHill?.kingOfTheHill?.pool_id) {
            if (block_chain === "SOL") {
                const tokenAddress = new PublicKey(kingOfHill?.kingOfTheHill?.token_address)
                marketCapCalSOl(tokenAddress, solInUsd, setMarketCap)
                bondingProgressSol(kingOfHill?.kingOfTheHill?.token_address);
            } else {
                console.log("hey i am in eth ")
                marketCapCalEth(kingOfHill?.kingOfTheHill?.pool_id, ethInUsd, setMarketCap)
                bondingProgressEth(kingOfHill?.kingOfTheHill?.token_address)
                
            }
        } else {
            if (block_chain === "SOL") {
                getRaydiumMarketCap(kingOfHill?.kingOfTheHill?.pool_id, solInUsd, setMarketCap)
                bondingProgressSol(kingOfHill?.kingOfTheHill?.token_address);
            } else {
                console.log("shent",kingOfHill?.kingOfTheHill?.token_address, ethInUsd, setMarketCap)
                getUniswapMarketCap(kingOfHill.kingOfTheHill?.token_address, ethInUsd, setMarketCap)
                bondingProgressEth(kingOfHill?.kingOfTheHill?.token_address)
            }
        }

    }, [kingOfHill])

    const handleSearch = () => {
        dispatch(searchCoins(searchQuery));
    };

    console.log("market-cap",marketCap)
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            dispatch(searchCoins(''));
        }
    };

    // const progress = 71;
    // const radius = 50;
    // const stroke = 10;
    // const normalizedRadius = radius - stroke * 2;
    // const circumference = normalizedRadius * 2 * Math.PI;
    // const strokeDashoffset = circumference - (kingOfHill?.kingOfTheHill?.bonding_curve_progress / 100) * circumference;
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progress = progressCurveBond || 0; // Ensure progress is defined
    // const progress = kingOfHill?.kingOfTheHill?.bonding_curve_progress || 0; // Ensure progress is defined
    const strokeDashoffset = circumference - (progress / 100) * circumference;


    return (
        <>
            <div
                className='pt-4  sm:pt-8 px-2 pb-0 md:px-4 flex flex-col items-center'>

                <h1 className='text-center text-[#C720EF] text-[20px] leading-[22px] md:text-[30px] md:leading-[32px] font-extrabold tracking-[2px]'
                    style={{
                        textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                    }}>
                    Guess <br /> Master
                </h1>

                <Link
                    to={`/trade/${kingOfHill?.kingOfTheHill?._id}/${kingOfHill?.kingOfTheHill?.token_address}`}
                    className='relative flex flex-col justify-center items-center w-full max-w-[516px] mt-[10px] p-4 pb-2 rounded-2xl' style={{ backgroundImage: `url(${group160})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute top-0 right-0">
                        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
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
                                strokeDashoffset={strokeDashoffset}
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="PixelOperatorbold absolute inset-0 flex items-center justify-center text-[#FFF9F9] text-sm font-bold">
                            {progress}%
                        </div>
                    </div>;

                    <div className='flex justify-center items-center p-1 w-[55px] h-[55px] bg-[#D680FF] rounded-2xl'>
                        <img className=' rounded-md h-full w-full' src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${kingOfHill?.kingOfTheHill?.metadata?.image}`} alt="" />
                    </div>

                    <div className='flex items-center gap-4'>
                        <span className='PixelOperator lightWhite text-[18px]'>Guess</span>
                        <span className='PixelOperator bg-[#FFF9F9] w-[4px] h-[4px] rounded-full'></span>
                        <span className='PixelOperator lightWhite text-[18px]'>$ {kingOfHill?.kingOfTheHill?.metadata?.name}</span>
                    </div>

                    <span className='PixelOperator lightWhite text-[18px] text-center'>Marketcap</span>
                    {/* <span className='PixelOperator text-[#FDA6FF] text-[22px]'>$ {kingOfHill?.kingOfTheHill?.market_cap}</span> */}
                    <span className='PixelOperator text-[#FDA6FF] text-[22px]'>$ {formatNumber(marketCap.data) }</span>

                </Link>

                {/* <div className='flex items-center justify-center gap-1 w-full max-w-[516px]'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
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
                </div> */}
            </div>
        </>
    );
};

export default Hero;
