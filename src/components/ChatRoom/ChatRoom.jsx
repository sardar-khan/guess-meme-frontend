import React, { useEffect, useState } from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'
import cmtImg from '../../assets/images/cmtImg.png'
import cmtImg2 from '../../assets/images/cmtImg2.png'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ReferralModal from '../Modals/ReferralModal'
import { selectCoinById } from '../../features/coinSlice'
import { useSelector } from 'react-redux'
import { Web3ModalProvider } from '../../web3/Web3Provider'
import { useAppKitAccount } from '@reown/appkit/react'
// import { fetchCoins, selectCoinById } from '../../features/coinSlice';

const ChatRoom = ({ coinData }) => {

    const { id } = useParams();
    const [threads, setThreads] = useState(null);
    const [threadID, setThreadID] = useState('');
    const [refferalError, setRefferalError] = useState(null);
    const [error, setError] = useState(null);
    const { isConnected } = useAppKitAccount()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const coin = useSelector((state) => selectCoinById(state, id));
    console.log("trade Coin", coin)

    console.log("coinDatacoinData", coinData)


    const fetchThreadData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}thread/view/${id}`);
            setThreads(response.data);
            setError(null);
            console.log("fetchThreadData", response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("No trades found for the specified token.");
            } else {
                setError("Error fetching coin data.");
            }
            console.error("Error fetching coin data:", error);
        }
    };
    useEffect(() => {
        fetchThreadData();
    }, [id, threadID, refferalError, isConnected]);



    const handleModalSubmit = (data) => {
        console.log("Comment:", data.comment, "Image:", data.image);
    };
    console.log("threads", threads)

    const handleReplyId = (threadid) => {
        setIsModalOpen(true)
        setThreadID(threadid)
    }

    const openModalReferral = () => {
        if (isConnected) {
            setIsModalOpen(true);
            setThreadID('');
            setRefferalError('')
        }
        else {
            setRefferalError('Connect Wallet First')
        }
    }

    return (
        <>
            <h2>ChatRoom</h2>
            <div className='flex flex-col mt-3'>

                <div className='secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]'>
                    <div className='flex items-center gap-1'>
                        <img src={logoSmall} alt="" />
                        <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8281c9]'>{coinData?.metadata?.name}</span>
                        <p className='Inter text-black text-[10px] font-medium'>
                            {new Date(coinData?.time).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}
                        </p>

                    </div>
                    <div className='flex gap-1'>
                        {coin?.coin?.image !== null && (
                            <div className='w-[128px] h-full max-h-[128px]'>
                                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`} className='w-full h-full' alt="" />
                            </div>
                        )}
                        <div className="pl-3 w-[calc(100%-128px)]">
                            <h5 className='Inter text-[#121212] text-sm font-bold'>{coinData?.metadata?.name} (ticker: {coinData?.ticker})</h5>
                            <p className='Inter text-sm font-medium'>
                                {coinData?.metadata?.description}
                            </p>
                        </div>
                    </div>
                </div>

                {threads ?
                    <div>
                        {/* Referral */}
                        {threads?.data?.map((item, index) => (
                            <div key={index} className='secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]'>
                                <div className='flex items-center gap-2'>
                                    <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.user_id?.profile_photo}`} alt="" />
                                    <Link to={`/userprofile/${item?.user_id?._id}`} className='Inter text-black text-[10px] font-semibold p-[2px] rounded-md bg-[#8E8DC7] cursor-pointer hover:underline'>{item?.user_id?.user_name}</Link>
                                    <p className='Inter text-[#343434] text-[10px] font-semibold'>
                                        {new Date(item?.createdAt).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}
                                    </p>
                                    <p className='Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline' onClick={() => handleReplyId(item?.thread_id)}>
                                        {item?.thread_id} [reply]
                                    </p>
                                </div>
                                <div className='flex gap-1'>
                                    {item?.image !== null && item?.image !== '' && (
                                        <div className='w-[128px] h-full max-h-[128px]'>
                                            <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.image}`} className='w-full h-full' alt="" />
                                        </div>
                                    )}

                                    <div className="w-[calc(100%-128px)] pl-2">
                                        <p className='Inter text-sm font-medium text-[#000000]'>
                                            <span className='text-[#4225ff] text-base font-extrabold'>{item?.reply_id}</span> {item?.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    :
                    <div className='SegoeUi text-2xl'>
                        No Referral
                    </div>
                }

                {refferalError && <div className='text-red-600 Inter'>{refferalError}</div>}
                <button
                    onClick={() => { openModalReferral() }}
                    className='themeBtn w-fit px-5 py-4 SegoeUi mt-5'>
                    <span>Referral</span>
                </button>

                {/* Referral Modal */}
                <ReferralModal
                    threadID={threadID}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    fetchThreadData={fetchThreadData}
                />


            </div >
        </>
    )
}

export default ChatRoom