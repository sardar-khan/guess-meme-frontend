import React, { useEffect, useState } from 'react';
import Arrowback from '../assets/icons/Arrowback.svg';
import { Link, useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom/ChatRoom';
import TradesTable from '../components/Tables/TradesTable';
import HoldersTable from '../components/Tables/HoldersTable';
import CandlestickComboChart from '../components/Charts/CandlestickComboChart';
import PlaceTrade from '../components/PlaceTrade/PlaceTrade';
import logoSmall from '../assets/icons/logoSmall.png';
import { toast } from 'react-toastify';
import { viewCoin } from '../utils/api';

const Threads = () => {
    const { id } = useParams();
    const [coinData, setCoinData] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                const response = await viewCoin(id);
                console.log('Single Coin Data:', response);
                setCoinData(response?.data);
            } catch (error) {
                console.error('Error fetching coin data:', error);
                toast.error('Failed to fetch coin data.');
            }
        };

        fetchCoinData();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(id).then(() => {
            toast.success('Text copied!');

            setIsDisabled(true);
            setTimeout(() => {
                setIsDisabled(false);
            }, 3000);
        }).catch((error) => {
            toast.error('Failed to copy text!');
        });
    };

   

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
                            <span className='Inter text-[#515151] font-normal text-xs'>{coinData?.name}</span>
                            <span className='Inter text-[#515151] font-normal text-xs'>Ticker: {coinData?.ticker}</span>
                            <span className='Inter text-[#662286] font-normal text-xs'>Market cap: ${coinData?.market_cap}</span>
                            <div className='flex items-end gap-2'>
                                <span className='Inter text-[#515151] font-normal text-xs'>CA:</span>
                                <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                    <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                        <input
                                            type="text"
                                            value={id}
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
                            </div>
                        </div>

                        <div className='Inter flex text-xs items-end text-[#662286] whitespace-nowrap'>
                            created by:
                            <div className='flex items-end gap-1'>
                                <img className='w-4 h-4 rounded-md' src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.metadata?.image}`} alt="" />
                                <Link to={`/userprofile/${coinData?.creator?._id}`} className='Inter text-black text-[12px] font-medium p-[2px] rounded-md bg-[#8E8DC7] whitespace-nowrap hover:underline'>{coinData?.creator?.user_name}</Link>
                            </div>
                        </div>
                    </div>
                    <CandlestickComboChart />
                    <ChatRoom coinData={coinData} />
                </div>
                <div className='flex flex-col gap-6 w-full lg:w-[30%]'>
                    <PlaceTrade coinData={coinData} />
                    <TradesTable />
                    <HoldersTable />
                </div>
            </div>
        </div>
    );
};

export default Threads;
