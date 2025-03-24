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
import editIcon from '../assets/icons/edit.png'
import img from '../assets/images/Group 159.png'

import userprofileImg from '../assets/images/userprofile.png'
import Follwoing from '../components/Follwoing'
import { CheckFollow, getNotifications, resetNotificationsCount, toggleFollow, ViewUser, viewUserprofile } from '../utils/api'
import { useAppKitAccount } from '@reown/appkit/react'
import Notifications from '../components/Notifications'
import { useNotificationContext } from '../context/NotificationContext'
import { useWalletContext } from '../context/WalletContext'
import { useAuthContext } from '../context/useAuth'
import { FaXTwitter } from 'react-icons/fa6'


const ViewUserProfile = () => {
    const { id } = useParams();
    const { isAuthenticated, user, logoutUser, setLogoutUser } = useAuthContext()
    const [activeTab, setActiveTab] = useState('coins created');
    const [showUserData, setShowUserData] = useState(false);
    const [notifications, setNotifications] = useState();
    const [notificationsTab, setNotificationsTab] = useState('notification');
    const { isConnected } = useAppKitAccount()
    const { block_chain } = useWalletContext()

    const { pusherLike, pusherFollow, pusherNotificationThread } = useNotificationContext();

    const tabs = [
        { id: 'coins created', label: 'Coins Created' },
        { id: 'coins held', label: 'Coins Held' },
        { id: 'notification', label: 'Notification' },
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' },
    ];

    const [profileState, setProfileState] = useState({
        data: null,
        loading: true,
        error: null,
    });
    console.log('profileState', profileState)



    const fetchUserProfile = async () => {
        try {
            // First, fetch user profile data
            const data = await ViewUser(user?._id);

            // Call viewUserprofile function as well

            setProfileState({ data: data, loading: false, error: null });
        } catch (err) {
            // Handle errors in case of failure
            setProfileState({
                data: null,
                loading: false,
                error: err.message || 'Failed to fetch user data',
            });
        }
    };
    useEffect(() => {
        user && fetchUserProfile();
    }, [user?._id, isConnected]);




    useEffect(() => {

        const FetchNotifications = async () => {
            try {
                const reponse = await getNotifications();
                console.log("respinse", reponse)
                setNotifications(reponse.data);

            } catch (error) {

            }
        }
        FetchNotifications();
    }, [id, user]);


    useEffect(() => {

    }, [notifications]);


    if (profileState.loading) return <div className='mt-4'><Loader /></div>;
    if (profileState.error) return <p>Error: {profileState.error}</p>;




    const handleNotificationCount = async (tabId) => {
        tabId === 'notification' ? handleNotificationReCount() : null
    }


    const handleNotificationReCount = async () => {
        try {
            const response = await resetNotificationsCount();
            if (response.status === 200) {
                // fetchUserProfile()
                setNotificationsTab("")


            }
        } catch (error) {
            console.error("notification Recount", error);
        }
    }

    console.log("hello", profileState?.data?.data?.user?.profile_photo)
    console.log("hey", `${import.meta.env.VITE_API_URL.slice(0, -1)}${profileState?.data?.data?.profileState}`)
    return (
        <div className=' '>

            <div className='flex flex-col lg:flex-row gap-4 justify-between max-w-[930px] mx-auto p-2 pt-10 pr-2 pb-[20px]'>

                <div className='w-full max-w-[100%] lg:max-w-[35%]'>

                    <CardWrapper>
                        <div className='flex flex-col items-center justify-center relative'>
                            {isConnected && <Link to='/editprofile'>
                                <img src={editIcon} className='w-[20px] absolute top-0 right-1 cursor-pointer' alt="" />
                            </Link>}
                            <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${profileState?.data?.data?.user?.profile_photo}`} className='w-[80px] h-[80px] rounded-md' alt="" />
                            <div className='text-center'>
                                <h5 className='PixelOperatorbold text-xl'>{profileState?.data?.data?.user?.user_name}</h5>
                                {/* <p className='text-base'>5 followers</p> */}
                                <p className='text-base'>{profileState?.data?.data?.user?.bio === 'some bio' ? 'No Bio' : profileState?.data?.data?.user?.bio}</p>

                                {profileState?.data?.data?.user?.x_link &&
                                    <a href={profileState?.data?.data?.user?.x_link} className='bg-[#1DA1F2] p-2 rounded-md mt-1 text-white flex hover:scale-110 transition-all ease-in-out ' target="_blank" rel="noopener noreferrer" > <FaXTwitter />
                                        <span className="Inter text-xs ml-2">
                                            {profileState?.data?.data?.user?.x_link
                                                ?.replace("https://twitter.com/", "")
                                                .toUpperCase()}
                                        </span>
                                    </a>
                                }
                            </div>
                        </div>
                        {/* {!showUserData &&
                            <button className="themeBtn w-fit mx-auto mt-4" onClick={handleToggleFollow}>
                                <span className="!text-xs">
                                    {checkFollow ? "Following" : "Follow"}
                                </span>
                            </button>
                        } */}
                    </CardWrapper>




                </div >

                <div className='w-full max-w-[100%] lg:max-w-[65%]'>
                    <CardWrapper>
                        <div className='flex flex-col items-center justify-center'>
                            <div className='bg-[#E9E9E9] p-[5px] text-2xl text-center PixelOperator rounded-lg w-full overflow-hidden'>{user?.wallet_address[0]?.address}</div>
                            {block_chain !== "SOL" ?
                                <div className='w-full'>
                                    <Link to={`https://sepolia.etherscan.io/address/${profileState?.data?.data?.user?.wallet_address[0]?.address}`} target='_blank' className='flex justify-end gap-1 mt-1 PixelOperator'>View on Etherscan <img src={Arrow} alt="" /></Link>
                                </div> :
                                <div className='w-full'>
                                    <Link to={`https://solscan.io/account/${profileState?.data?.data?.user?.wallet_address[0]?.address}?cluster=devnet`} target='_blank' className='flex justify-end gap-1 mt-1 PixelOperator'>View on Solscan <img src={Arrow} alt="" /></Link>
                                </div>}
                        </div>
                    </CardWrapper>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <CardWrapper>
                            <p className='text-base text-center flex justify-center items-center gap-1'>Mentions received: {profileState?.data?.data?.user?.total_mentions} <img src={commet} alt="" /></p>
                        </CardWrapper>
                        <CardWrapper>
                            <p className='text-base text-center flex justify-center items-center gap-1 text-[#D9223E]'>Likes Received: {profileState?.data?.data?.user?.total_likes} <img src={heart} alt="" /></p>
                        </CardWrapper>
                    </div>

                    <CardWrapper>

                        <div className='flex flex-row justify-center flex-wrap gap-1'>
                            {tabs.map((tab) => {
                                // Show all tabs if showUserData is true, else skip "Notification" tab

                                return (
                                    <button
                                        key={tab.id}
                                        className={`relative PixelOperator w-fit px-2 py-1 rounded-lg font-semibold border border-[#7539F4] ${activeTab === tab.id
                                            ? 'bg-[#7539F4] text-white'
                                            : 'bg-white border-[#7539F4] text-[#000]'
                                            }`}
                                        onClick={() => { setActiveTab(tab.id); handleNotificationCount(tab.id) }}
                                    >

                                        {tab.id === 'notification' && notificationsTab === 'notification' && profileState?.data?.data?.user?.unread_notifications > 0 && <span span className='absolute text-white font-semibold flex justify-center items-center p-2 right-0 top-0 bg-red-600 w-[10px] h-[10px] mt-[-7px] mr-[-7px] rounded-full'>{profileState?.data?.data?.user?.unread_notifications}</span>}
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>


                    </CardWrapper>


                </div>

            </div >

            <div className='w-full  max-w-[400px] mx-auto pb-[100px]'>
                {/* tabs start */}
                <div className=''>
                    {/* <div className={`PixelOperator w-fit px-2 py-1 rounded-lg font-semibold border border-[#7539F4] bg-[#7539F4] text-white`}>{activeTab}</div> */}

                    {activeTab === 'coins held' &&
                        <>
                            {profileState?.data?.data?.coins_held.length === 0 ?
                                <div className='PixelOperator text-2xl text-center'>
                                    No Holding Coin
                                </div>
                                :
                                <>
                                    {profileState?.data?.data?.coins_held?.map((coinHeld, index) => (
                                        <CardWrapper>
                                            <CoinheldCard coinHeld={coinHeld} />
                                        </CardWrapper>
                                    ))}
                                </>
                            }

                        </>
                    }

                    {activeTab === 'coins created' &&
                        <>
                            {profileState?.data?.data?.user?.coins_created.length === 0 ?
                                <div className='PixelOperator text-2xl text-center'>
                                    No Created Coins
                                </div>
                                :
                                <>
                                    {profileState?.data?.data?.user?.coins_created?.map((coinsCreated, index) => (
                                        <CardWrapper>
                                            <CoinsCreatedCard coinsCreated={coinsCreated} userData={user} />
                                        </CardWrapper>
                                    ))}
                                </>
                            }

                        </>
                    }
                    {activeTab === 'notification' &&
                        <div className='md:pl-20 w-full'>
                            {notifications?.length === 0 ?
                                <div className='PixelOperator text-2xl text-center'>
                                    No Notifications
                                </div>
                                :
                                <div className='bg-red-200 w-full mx-auto'>
                                    {pusherLike.length > 0 &&
                                        pusherLike.map((pushernNotification, index) => (
                                            <SmallCardWrapper>
                                                <Notifications key={index} notification={pushernNotification} />
                                            </SmallCardWrapper>
                                        ))}

                                    {pusherFollow.length > 0 &&
                                        pusherFollow.map((pushernNotification, index) => (
                                            <SmallCardWrapper>
                                                <Notifications key={index} notification={pushernNotification} />
                                            </SmallCardWrapper>
                                        ))}
                                    {pusherNotificationThread.length > 0 &&
                                        pusherNotificationThread.map((pushernNotification, index) => (
                                            <SmallCardWrapper>
                                                <Notifications key={index} notification={pushernNotification} />
                                            </SmallCardWrapper>
                                        ))}

                                    {pusherLike.length <= 0 && pusherFollow.length <= 0 && pusherNotificationThread.length <= 0 && (
                                        notifications.map((notification, index) => (
                                            <SmallCardWrapper>
                                                <Notifications key={index} notification={notification} />
                                            </SmallCardWrapper>
                                        )))}
                                </div>
                            }


                        </div>
                    }
                    {activeTab === 'followers' &&
                        <div className='grid grid-cols-1 sm:grid-cols-1 gap-3'>

                            {profileState?.data?.data?.user?.followers?.length === 0 ?
                                <div className='PixelOperator text-2xl text-center'>
                                    No Followers
                                </div>
                                :
                                <div className='mx-auto w-full'>
                                    {profileState?.data?.data?.user?.followers?.map((followers, index) => (
                                        <SmallCardWrapper>
                                            <Followers followers={followers} followerLength={profileState?.data?.data?.user?.followers.length} />
                                        </SmallCardWrapper>
                                    ))}
                                </div>
                            }
                        </div>
                    }
                    {activeTab === 'following' &&
                        <div className='grid grid-cols-1 sm:grid-cols-1 gap-3'>
                            {profileState?.data?.data?.user?.following.length === 0 ?
                                <div className='PixelOperator text-2xl text-center'>
                                    No Following
                                </div>
                                :
                                <div className='mx-auto w-full'>
                                    {profileState?.data?.data?.user?.following?.map((followers, index) => (
                                        <SmallCardWrapper>
                                            <Follwoing Follwoing={followers} />
                                        </SmallCardWrapper>
                                    ))}
                                </div>
                            }
                        </div>
                    }

                </div>
                {/* tabs End */}
            </div>


        </div >
    )
}

export default ViewUserProfile