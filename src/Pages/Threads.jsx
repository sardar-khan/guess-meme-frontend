import React, { useEffect, useState } from 'react';
import Arrowback from '../assets/icons/Arrowback.svg';
import { Link, useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom/ChatRoom';
import TradesTable from '../components/Tables/TradesTable';
import HoldersTable from '../components/Tables/HoldersTable';
import { toast } from 'react-toastify';
import { kingoftheHill_progress, Progress_curve_bond, tokenTransferStatus, viewCoin } from '../utils/api';
import Progress from '../components/Progress';
import PlaceTrade from '../components/PlaceTrade/PlaceTrade';
import HighchartsReactNew from '../components/Charts/HighchartsReactNew';
import { useNotificationContext } from '../context/NotificationContext';
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import logoSmall from '../assets/icons/logoSmall.png';
import { CiGlobe } from "react-icons/ci";
import { useWalletContext } from '../context/WalletContext';
import PlaceTradeSol from '../components/PlaceTrade/PlaceTradeSol';
import { calculateBondingCurveProgress, calculateKingOfTheHillProgress, marketCapCalSOl } from '../components/PlaceTrade/solanaBuySellFunction';
import { calculateEthBondingCurveProgress, getUniswapMarketCap, marketCapCalEth } from '../components/PlaceTrade/ether-trade-utils';
import LightweightCandlestickChart from '../components/Charts/LightweightCandlestickChart ';
import { PublicKey } from '@solana/web3.js';
import { getRaydiumMarketCap } from '../web3/market-cap';


const SocialLinks = ({ coinData }) => {
    console.log("coinData social", coinData)
    return (
        <div className='flex  gap-2'>
            {coinData?.twitter_link && <a href={coinData?.twitter_link === 'NA' ? '#' : coinData?.twitter_link} target={coinData?.twitter_link === 'NA' ? "" : "_blank"} className="bg-[#8E8DC7]  py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"><FaXTwitter /> twitter</a>}
            {coinData?.telegram_link && <a href={coinData?.telegram_link === 'NA' ? '#' : coinData?.telegram_link} target={coinData?.telegram_link === 'NA' ? "" : "_blank"} className="bg-[#8E8DC7] py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"> <FaTelegramPlane />telegram</a>}
            {coinData?.website && <a href={coinData?.website === 'NA' ? '#' : coinData?.website} target={coinData?.website === 'NA' ? "" : "_blank"} className="bg-[#8E8DC7] py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"><CiGlobe /> website </a>}
        </div>
    )

}

const Threads = () => {
    const { id, tokenid } = useParams();
    const [coinData, setCoinData] = useState(null);
    const [kingoftheHill, setKingoftheHill] = useState();
    const [ProgressCurveBond, setProgressCurveBond] = useState();
    const [isDisabled, setIsDisabled] = useState(false);
    const [coinStatus, setCoinStatus] = useState({
        loading: false,
        data: "null"
    });
    const { pusherAfterTrade } = useNotificationContext();
    const [refresh, setRefresh] = useState(false)
    const { block_chain ,solInUsd, ethInUsd} = useWalletContext()
    const [marketCap, setMarketCap] = useState({
        loading: false,
        data: "null"
    });
    const [activeTab, setActiveTab] = useState("ChatRoom");



    useEffect(() => {

        if (id && tokenid) {
            fetchTokenStatus();
            fetchCoinData();
            fetchMarketCap();

        }
    }, [id, ProgressCurveBond, refresh]);

    const fetchTokenStatus = async (token_address) => {
        const coinShiftingStatus = await tokenTransferStatus(id)
        console.log("status", coinShiftingStatus);
        setCoinStatus(coinShiftingStatus)
    }


    const fetchCoinData = async () => {
        try {
            const response = await viewCoin(id);
            setCoinData(response?.data);
            // fetchProgress_curve_bond(response?.data?.token_address);
            // fetchKingoftheHill_progress(response?.data?.token_address);
            block_chain === "SOL" ? fetchProgress_curve_bond(tokenid) : bondingProgressEth(tokenid)
            block_chain === "SOL" && fetchKingoftheHill_progress(tokenid);
        } catch (error) {
            console.error('Error fetching coin data:', error);
            toast.error('Failed to fetch coin data.');
        }
    };
    const fetchMarketCap = async () => {
        if(!coinData?.pool_id){
        if (block_chain === "SOL") {
            const tokenAddress = new PublicKey(tokenid)
            marketCapCalSOl(tokenAddress,solInUsd, setMarketCap)
        } else {
            marketCapCalEth(tokenid,ethInUsd, setMarketCap)
        }
    }else{
        if (block_chain === "SOL") {
             getRaydiumMarketCap(coinData?.pool_id, solInUsd, setMarketCap)
        } else {
            getUniswapMarketCap(tokenid,ethInUsd, setMarketCap)
        }

    }
    }
    const fetchKingoftheHill_progress = async (token_address) => {
        try {
            const response = await calculateKingOfTheHillProgress(token_address, true);
            setKingoftheHill(response?.kingOfTheHillProgress);
        } catch (error) {
            console.error('Error kingoftheHill_progress:', error);
            //  toast.error('Failed to kingoftheHill_progress.');
        }
    };

    const fetchProgress_curve_bond = async (token_address) => {
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

            console.log("bonding-curve-progress", response)
            setProgressCurveBond(response?.bondingCurveProgress);
            setKingoftheHill(response?.kingOfTheHillProgress);
        } catch (error) {
            console.error('Error Progress_curve_bond:', error);
            //  toast.error('Failed to Progress_curve_bond.');
        }
    };




    const handleCopy = () => {
        navigator.clipboard.writeText(coinData?.token_address).then(() => {
            toast.success('Contract Address copied');

            setIsDisabled(true);
            setTimeout(() => {
                setIsDisabled(false);
            }, 3000);
        }).catch((error) => {
            toast.error('Failed to copy text!');
        });
    };

    console.log("yashh", coinData)
    return (
        <div className='py-10 px-4 !pb-[100px] md:p-10'>
            <Link to='/' className='flex items-center gap-2 w-fit'>
                <img src={Arrowback} alt="" />
                <span className='Inter text-[#515151] font-normal text-xs'>GO BACK</span>
            </Link>

            <div className='flex justify-between flex-col lg:flex-row gap-3'>
                <div className='w-full lg:w-[70%] mt-5'>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between mb-[20px]'>
                        <div className='flex items-end gap-[15px] flex-wrap lg:flex-nowrap'>
                            {coinData?.status !== "created" && <span className='Inter text-[#515151] font-normal text-xs'>{coinData?.name}</span>}
                            {coinData?.status !== "created" && <span className='Inter text-[#515151] font-normal text-xs'>Ticker: {coinData?.ticker}</span>}
                            {/* <span className='Inter text-[#662286] font-normal text-xs'>Market cap: ${coinData?.market_cap}</span> */}
                            {!marketCap.loading && <span className='Inter text-[#662286] font-normal text-xs'>
                                Market cap: ${marketCap?.data ? Number(marketCap?.data).toLocaleString('en-US') : 'N/A'}
                            </span>}

                            {coinData?.status !== "created" ? <div className='flex items-end gap-2'>
                                <span className='Inter text-[#515151] font-normal text-xs'>CA:</span>
                                <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                    <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                        <input
                                            type="text"
                                            value={coinData?.token_address}
                                            name=""
                                            id=""
                                            className='w-[150px] px-2 py-1 text-xs font-normal'
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <button
                                    className={`themeBtn PixelOperatorbold !text-[10px] font-normal min-w-fit px-2 py-1 z-[0] ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={handleCopy}
                                    disabled={isDisabled}
                                >
                                    <span>Copy</span>
                                </button>
                            </div> : <></>}
                        </div>

                        {coinData?.status !== "created" ? <div className='Inter flex text-xs items-end text-[#662286] whitespace-nowrap'>
                            Created by:
                            <div className='flex items-end gap-1'>
                                {coinData?.creator?.profile_photo === "https://ibb.co/7zrpRwk" ? <img className='w-4 h-4 rounded-md' src={logoSmall} alt="" /> : <img className='w-4 h-4 rounded-md' src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.creator?.profile_photo}`} alt="" />}
                                <Link to={`/profile/${coinData?.creator?._id}`} className='Inter text-black text-[12px] font-medium p-[2px] rounded-md bg-[#8E8DC7] whitespace-nowrap hover:underline'>{coinData?.creator?.user_name}</Link>
                            </div>
                        </div> : <></>}
                    </div>
                    {/* <CandlestickComboChart /> */}
                    {/* <HighchartsReactNew /> */}
                    <LightweightCandlestickChart coinId={id} />

                    {/* <AdvancedTradingViewChart symbol="BINANCE:ETHUSDT" /> */}

                    <div className="flex flex-col mt-4">
                        {/* Tab Buttons */}
                        <div className="flex justify-start items-center gap-1">
                            <button
                                className={`text-sm Inter rounded-md py-1 px-3 transition-colors ${activeTab === "ChatRoom" ? "bg-[#A49DD2] text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("ChatRoom")}
                            >
                                ChatRoom
                            </button>
                            <button
                                className={`text-sm Inter rounded-md py-1 px-3 transition-colors ${activeTab === "Trades" ? "bg-[#A49DD2] text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("Trades")}
                            >
                                Trades
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="pt-4">
                            {activeTab === "ChatRoom" && <ChatRoom coinData={coinData} />}
                            {activeTab === "Trades" && <TradesTable />}
                        </div>
                    </div>


                </div>
                <div className='flex flex-col gap-4 w-full lg:w-[30%]'>
                    {
                        block_chain === "SOL" ?
                            (coinData && <PlaceTradeSol refresh={refresh} setRefresh={setRefresh} coinData={coinData} tokenid={tokenid} />)
                            :

                            (coinData && <PlaceTrade coinData={coinData} />)
                    }

                    <SocialLinks coinData={coinData} />
                    <div className='flex flex-col gap-2'>
                        <Progress title="Bonding curve progress" status={"bonding"} poolId={coinData?.pool_id}
                            progress={ProgressCurveBond} pusherProgress={ProgressCurveBond} isBondingCurve={true} />

                        <Progress title="Guess master" status={"guess"} poolId={coinData?.pool_id} progress={kingoftheHill}
                            pusherProgress={kingoftheHill} isBondingCurve={false} />
                    </div>
                    <HoldersTable coinData={coinData} />

                </div>
            </div>
        </div>
    );
};

export default Threads;
