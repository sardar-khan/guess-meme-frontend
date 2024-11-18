import React, { useState } from 'react'
import userprofileImg from '../assets/images/userprofile.png'
import Arrow from '../assets/icons/Group.png'
import heart from '../assets/icons/heart.png'
import commet from '../assets/icons/commet.png'
import { Link } from 'react-router-dom'
import CardWrapper from '../components/CardWrapper/CardWrapper'

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('coins held');

    const tabs = [
        { id: 'coins held', label: 'Coins Held' },
        { id: 'coins created', label: 'Coins Created' },
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' },
    ];


    return (
        <div className='flex flex-col lg:flex-row gap-4 justify-between max-w-[930px] mx-auto p-2 pt-10 pr-2 pb-[100px]'>
            
            
            <div className='w-full max-w-[100%] lg:max-w-[30%]'>

                <CardWrapper>
                    <div className='flex flex-col items-center justify-center'>
                        <img src={userprofileImg} className='w-[80px] h-[80px]' alt="" />
                        <div className='text-center'>
                            <h5 className='PixelOperatorbold text-xl'>@4sssdaaz</h5>
                            <p className='text-base'>5 followers</p>
                            <p className='text-base'>Lfg</p>
                        </div>
                    </div>
                    <button className='themeBtn w-fit mx-auto mt-4'><span className='!text-xs'>follow</span></button>
                </CardWrapper>

                <div className='mt-7'>
                    <div className={`PixelOperator w-fit px-2 py-1 rounded-lg font-semibold border border-[#7539F4] bg-[#7539F4] text-white`}>{activeTab}</div>

                    <CardWrapper>

                        <div className="">
                            {activeTab === 'coins held' &&
                                <div className='flex flex-col items-center justify-center'>
                                    <div className='w-[80px] h-[80px] border rounded-full flex object-cover overflow-hidden'>
                                        <img src={userprofileImg} className='' alt="" />
                                    </div>
                                    <div className='text-center'>
                                        <h5 className='PixelOperatorbold text-xl'>5314749 Jorgie</h5>
                                        <p className='text-base'>64.7336 SOL</p>
                                        <div className='flex justify-between items-center w-full mt-2'>
                                            <p className='text-sm'>Refresh</p>
                                            <p className='text-sm'>View Coins</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            {activeTab === 'coins created' && <p>Content for Coins Created</p>}
                            {activeTab === 'followers' && <p>Content for Followers</p>}
                            {activeTab === 'following' && <p>Content for Following</p>}
                        </div>
                    </CardWrapper>
                </div>


            </div>

            <div className='w-full max-w-[100%] lg:max-w-[70%]'>
                <CardWrapper>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='bg-[#E9E9E9] p-[5px] text-2xl text-center PixelOperator rounded-lg w-full overflow-hidden'>9oMoQZf7WHz7RjP9nmQ9y894ReNvSnphLMGBKLWwwZaC</div>
                        <div className='w-full'>
                            <Link to='' className='flex justify-end gap-1 mt-1 PixelOperator'>View on Solscan <img src={Arrow} alt="" /></Link>
                        </div>
                    </div>
                </CardWrapper>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <CardWrapper>
                        <p className='text-base text-center flex justify-center items-center gap-1'>Mentions received: 12 <img src={commet} alt="" /></p>
                    </CardWrapper>
                    <CardWrapper>
                        <p className='text-base text-center flex justify-center items-center gap-1 text-[#D9223E]'>Likes Received: 817 <img src={heart} alt="" /></p>
                    </CardWrapper>
                </div>

                <CardWrapper>
                    <div className='flex flex-col gap-1'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`PixelOperator w-fit px-2 py-1 rounded-lg font-semibold border border-[#7539F4] ${activeTab === tab.id
                                    ? 'bg-[#7539F4] text-white'
                                    : 'bg-white border-[#7539F4] text-[#000]'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </CardWrapper>


            </div>



        </div>
    )
}

export default UserProfile