import React, { useEffect, useState } from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'
import cmtImg from '../../assets/images/cmtImg.png'
import cmtImg2 from '../../assets/images/cmtImg2.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ReferralModal from '../Modals/ReferralModal'

const ChatRoom = () => {

    const { id } = useParams();
    const [threads, setThreads] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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

        fetchThreadData();
    }, [id]);

    const handleModalSubmit = (data) => {
        console.log("Comment:", data.comment, "Image:", data.image);
    };
    console.log("threads", threads)
    return (
        <>
            <h2>ChatRoom</h2>
            <div className='flex flex-col gap-1 mt-3'>
                {threads?.data?.length > 0 ?
                    <div>

                        {threads?.data?.map((item, index) => (
                            <div key={index} className='secondary-bg p-[4px] pb-2'>
                                <div className='flex items-center gap-2'>
                                    <img src={logoSmall} alt="" />
                                    <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7]'>FoykzN (dev)</span>
                                </div>
                                <div className='flex gap-3'>
                                    <div className='w-[128px] h-full max-h-[128px]'>
                                        {item?.image !== null && (
                                            <img src={item?.image} className='w-full h-full' alt="" />
                                        )}
                                    </div>
                                    <div className="w-[calc(100%-128px)]">
                                        <h5 className='Inter text-[#121212] text-sm font-bold'>GOD PEPE (ticker: GODPE)</h5>
                                        <p className='Inter text-xs font-normal'>
                                            {item?.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}



                        {/* Referral */}
                        <div className='secondary-bg p-[4px] pb-2'>
                            <div className='flex items-center gap-2'>
                                <img src={logoSmall} alt="" />
                                <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7]'>FoykzN (dev)</span>
                            </div>
                            <div className='flex gap-3'>
                                <div className='w-[128px] h-full max-h-[128px] border'>
                                    <img src={cmtImg2} className='w-full h-full' alt="" />
                                </div>
                                <div className="w-[calc(100%-128px)]">
                                    <p className='Inter text-xs font-normal text-[#555]'>
                                        Dex ready, burn incoming, get your seats !
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='SegoeUi text-2xl'>
                        No Referral
                    </div>
                }

                <button
                    onClick={() => setIsModalOpen(true)}
                    className='themeBtn w-fit px-5 py-4 SegoeUi mt-5'>
                    <span>Referral</span>
                </button>

                {/* Referral Modal */}
                <ReferralModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />


            </div >
        </>
    )
}

export default ChatRoom