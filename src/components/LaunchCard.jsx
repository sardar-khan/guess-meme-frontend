import React, { useEffect, useState } from 'react'
import CardImg from '../assets/images/card 1.png'
import { Link } from 'react-router-dom'
import { calculateBondingCurveProgress, marketCapCalSOl, TokenPriceCalculations } from './PlaceTrade/solanaBuySellFunction'
import { fetchUsdPrice, fetchUsdPriceEth, formatNumber } from '../utils/helper'
import { useWalletContext } from '../context/WalletContext'
import { calculateEthBondingCurveProgress, getUniswapMarketCap, marketCapCalEth } from './PlaceTrade/ether-trade-utils'
import { fetchPrice } from './PlaceTrade/utils'
import { PublicKey } from '@solana/web3.js'
import { ethereumTokenInfo, getBuySellInEthBuy } from './PlaceTrade/TokenPriceCalculations'
import { getCreatorBuyToken } from '../utils/api'
import { getRaydiumMarketCap } from '../web3/market-cap'

const LaunchCard = ({ setSpace, coinData, topCoins, status }) => {
    const [ProgressCurveBond, setProgressCurveBond] = useState()

    const { block_chain, solInUsd, ethInUsd } = useWalletContext()
    const [marketCap, setMarketCap] = useState({
        loading: false,
        data: "null"
    });

    console.log("prices-from-context", solInUsd, ethInUsd)

    // const marketCapCalSOl = async (tokenAddress) => {
    //     try {
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: true
    //         }));


    //         //fetch 1 token price
    //         const oneTokenPrice = await TokenPriceCalculations(
    //             tokenAddress,
    //             1,
    //             false,
    //             true
    //         )

    //         //fetch sol price in usd
    //         const priceInUsd = await fetchUsdPrice();

    //         //calculate 1 token price in usd
    //         const tokenPriceInUsdt = priceInUsd?.solPrice * oneTokenPrice?.tokensbuy

    //         // mul by billion to get the current market cap of token
    //         const marketCap = tokenPriceInUsdt * 1000000000
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: false,
    //             data: marketCap
    //         }));

    //     } catch (error) {
    //         console.log("error while market-cap", error)
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: false,
    //             data: ""
    //         }));
    //     }
    // }

    // const marketCapCalEth = async (tokenAddress) => {
    //     try {
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: true
    //         }));


    //         //fetch 1 token price

    //         const data = await ethereumTokenInfo();

    //         const virtualSolReserves = BigInt(data?.virtualSolReserves);
    //         const virtualTokenReserves = BigInt(data?.virtualTokenReserves);
    //         const k = virtualSolReserves * virtualTokenReserves;

    //         const oneTokenPrice = getBuySellInEthBuy(1, k, virtualSolReserves, virtualTokenReserves)
    //         //fetch sol price in usd
    //         const priceInUsd = await fetchUsdPriceEth();
    //         //calculate 1 token price in usd
    //         const tokenPriceInUsd = priceInUsd?.ethPrice * oneTokenPrice?.tokensbuy
    //         // mul by billion to get the current market cap of token
    //         const marketCap = tokenPriceInUsd * 1000000000
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: false,
    //             data: marketCap
    //         }));

    //     } catch (error) {
    //         console.log("error while market-cap", error)
    //         setMarketCap(prevState => ({
    //             ...prevState,
    //             loading: false,
    //             data: ""
    //         }));
    //     }
    // }


    useEffect(() => {
        if (!coinData?.coin?.token_address) return

        if (!coinData?.coin?.pool_id) {
            if (block_chain === "SOL") {
                const tokenAddress = new PublicKey(coinData?.coin?.token_address)
                marketCapCalSOl(tokenAddress, solInUsd, setMarketCap)
                bondingProgressSol(coinData?.coin?.token_address);
            } else {
                console.log("hey i am in eth ")
                marketCapCalEth(coinData?.coin?.token_address, ethInUsd, setMarketCap)
                bondingProgressEth(coinData?.coin?.token_address)
            }
        } else {
            if (block_chain === "SOL") {
                getRaydiumMarketCap(coinData?.coin?.pool_id, solInUsd, setMarketCap)
                bondingProgressSol(coinData?.coin?.token_address);
            } else {
                console.log("shent",coinData?.coin?.token_address, ethInUsd, setMarketCap)
                getUniswapMarketCap(coinData?.coin?.token_address, ethInUsd, setMarketCap)
                bondingProgressEth(coinData?.coin?.token_address);
            }
        }

    }, [coinData])

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

    console.log("coinData-shares", coinData?.coin?.pool_id, status)



    return (
        <Link to={`/trade/${coinData?.coin?._id}/${coinData?.coin?.token_address}`} className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[5px] w-full bg-white' ></div>
            <div className='absolute top-0 left-0 h-full w-[5px] bg-white'></div>
            <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[8px] bg-[#7D73BF]'></div>
            <div className='absolute bottom-0 right-0 w-[99.2%] h-[5px] bg-[#7D73BF]'></div>
            <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
            <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

            <div className='secondary-bg h-full w-full border-[3px] border-l-[15px] border-t-[8px] border-r-[15px] border-b-[15px] border-[#A49DD2]'>

                <div className='h-[200px] w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>
                    <div className={`flex p-[5px] h-[200px] w-full justify-between gap-1 border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff0] border-r-[#fff0]`}>

                        <div className="w-full max-w-[150px] h-[180px]  flex justify-start items-start">
                            {coinData?.coin?.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.coin?.image}`}
                                    className="w-full max-h-[180px] object-cover "
                                    alt=""
                                />
                            ) : (
                                <img src={CardImg} className="w-full h-full object-cover" alt="" />
                            )}
                        </div>


                        <div className={`relative bg-white w-[calc(100%-100px)] sm:w-[calc(100%-150px)] min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}>
                            <div className={`flex flex-col justify-between p-[5px] md:p-[8px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}>
                                <div>
                                    {status === 'deployed' &&
                                        <h5 className='PixelOperatorbold flex items-center  gap-1 text-[10px] md:text-[14px]'>Created by <ShowCreatorImage coinData={coinData} /> <span className='hover:underline'> <Link to={`/profile/${coinData?.coin?.creator?._id}`}>{coinData?.coin?.creator?.user_name}</Link> </span></h5>}

                                    {!marketCap.loading && <h5 className='PixelOperatorbold text-[#D9223E] text-[12px] md:text-[14px]'>Marketcap: ${formatNumber(marketCap.data)}</h5>}
                                    {/* <h5 className='PixelOperatorbold text-[#D9223E] text-[12px] md:text-[14px]'>Marketcap: {coinData?.coin?.market_cap}</h5> */}
                                    <div className=''>
                                        <div className='flex justify-between items-end w-full mt-[7px] md:mt-[15px]'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[15px]'>Progress:</h5>
                                            <h5 className='PixelOperatorbold text-[10px] md:text-[13px]'>{ProgressCurveBond || 0}% to {block_chain === 'SOL' ? 'Raydium' : 'Uniswap'}</h5>
                                        </div>

                                        {/* <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1 after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div> */}
                                        <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1'>
                                            <div
                                                className='absolute bg-[#15C570] h-full'
                                                style={{ width: `${ProgressCurveBond || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>


                                    <ShowCreatorBuyTokens coinData={coinData} />
                                    {/* <div className='flex justify-cetner mt-2 items-center w-full'>
                                        <div className='PixelOperatorbold text-[12px]'>Creator has not bought
                                            any tokens</div>

                                    </div> */}
                                </div>


                                <div className=''>
                                    {/* <div className='flex justify-between w-full mt-[7px] md:mt-[15px]'>
                                        <h5 className='PixelOperatorbold text-[12px] md:text-[15px]'>Trust Score:</h5>
                                    </div>

                                    <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1'>
                                        <div
                                            className='absolute bg-[#15C570] h-full'
                                            style={{ width: `${coinData?.trust_score || 0}%` }}
                                        ></div>
                                    </div> */}
                                    <div className='text-black PixelOperator mt-3 capitalize truncate text-[12px] leading-[10px] md:text-[16px] md:leading-[13px] tracking-[-1px]'><strong className='PixelOperatorbold'>{coinData?.status === 'created' ? 'guess' : coinData?.coin?.name}</strong> (ticker: {coinData?.status === 'created' ? '?' : coinData?.coin?.ticker})</div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Link >
    )
}

export default LaunchCard



const ShowCreatorBuyTokens = ({ coinData }) => {
    return (
        <>
            {!coinData?.coin?.dev_buy ? (
                <div className="flex justify-center items-center w-full mt-2">
                    <div className="PixelOperatorbold text-[12px]">
                        Creator has bought <span className="text-[14px]">{0}</span> coins
                    </div>
                </div>
            ) : (
                <div className="flex justify-center mt-2 items-center w-full">
                    <div className="PixelOperatorbold text-[12px]">
                        Creator has bought <span className="text-[14px]">{formatNumber(coinData?.coin?.dev_buy)}</span> coins
                    </div>
                </div>
            )
            }

        </>
    )
}

const ShowCreatorImage = ({ coinData }) => {

    return (
        <>
            <img
                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.coin?.image}`}
                className=" rounded-full border shadow-md h-4 w-4 object-cover "
                alt=""
            />

        </>
    )

}