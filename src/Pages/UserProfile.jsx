import React, { useEffect, useState } from 'react'
import Arrow from '../assets/icons/Group.png'
import heart from '../assets/icons/heart.png'
import commet from '../assets/icons/commet.png'
import { Link, useParams } from 'react-router-dom'
import CardWrapper from '../components/CardWrapper/CardWrapper'
import Loader from '../components/Loader'
import CoinheldCard from '../components/CoinheldCard'
import CoinsCreatedCard from '../components/CoinsCreatedCard'
import Followers from '../components/Followers'
import SmallCardWrapper from '../components/CardWrapper/SmallCardWrapper'
import cmtImg from '../assets/images/cmtImg.png'
import userprofileImg from '../assets/images/userprofile.png'
import Follwoing from '../components/Follwoing'
import { ViewUser } from '../utils/api'

const UserProfile = () => {
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState('coins held');

    const tabs = [
        { id: 'coins held', label: 'Coins Held' },
        { id: 'coins created', label: 'Coins Created' },
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' },
    ];

    const [profileState, setProfileState] = useState({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await ViewUser(id);
                setProfileState({ data, loading: false, error: null });
            } catch (err) {
                setProfileState({
                    data: null,
                    loading: false,
                    error: err.message || 'Failed to fetch user data',
                });
            }
        };

        fetchUserProfile();
    }, []);
    console.log("profileState", profileState)

    if (profileState.loading) return <div className='mt-4'><Loader /></div>;
    if (profileState.error) return <p>Error: {profileState.error}</p>;


    return (
        <div className='flex flex-col lg:flex-row gap-4 justify-between max-w-[930px] mx-auto p-2 pt-10 pr-2 pb-[100px]'>


            <div className='w-full max-w-[100%] lg:max-w-[35%]'>

                <CardWrapper>
                    <div className='flex flex-col items-center justify-center'>
                        <img src={userprofileImg} className='w-[80px] h-[80px]' alt="" />
                        <div className='text-center'>
                            <h5 className='PixelOperatorbold text-xl'>{profileState?.data?.data?.user?.user_name}</h5>
                            <p className='text-base'>5 followers</p>
                            <p className='text-base'>{profileState?.data?.data?.user?.bio}</p>
                        </div>
                    </div>
                    <button className='themeBtn w-fit mx-auto mt-4'><span className='!text-xs'>follow</span></button>
                </CardWrapper>
                {/* tabs start */}
                <div className='mt-7'>
                    <div className={`PixelOperator w-fit px-2 py-1 rounded-lg font-semibold border border-[#7539F4] bg-[#7539F4] text-white`}>{activeTab}</div>

                    {activeTab === 'coins held' &&
                        <CardWrapper>
                            <CoinheldCard />
                        </CardWrapper>
                    }

                    {activeTab === 'coins created' &&
                        <CardWrapper>
                            <CoinsCreatedCard />
                        </CardWrapper>
                    }
                    {activeTab === 'followers' &&
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <SmallCardWrapper>
                                <Followers img={cmtImg} />
                            </SmallCardWrapper>
                            <SmallCardWrapper>
                                <Followers img={userprofileImg} />
                            </SmallCardWrapper>
                        </div>
                    }
                    {activeTab === 'following' &&
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <SmallCardWrapper>
                                <Follwoing img={userprofileImg} />
                            </SmallCardWrapper>
                            <SmallCardWrapper>
                                <Follwoing img={cmtImg} />
                            </SmallCardWrapper>
                        </div>
                    }

                </div>
                {/* tabs End */}



            </div >

            <div className='w-full max-w-[100%] lg:max-w-[65%]'>
                <CardWrapper>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='bg-[#E9E9E9] p-[5px] text-2xl text-center PixelOperator rounded-lg w-full overflow-hidden'>{profileState?.data?.data?.user?.wallet_address[0]?.address}</div>
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



        </div >
    )
}

export default UserProfile