import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from './LaunchCard';
import { fetchCoins, selectDeployedCoins, selectCreatedCoins, selectFilteredCoins } from '../features/coinSlice';
import AnimationToggle from './AnimationToggle';
import Pusher from 'pusher-js';
import { useNotificationContext } from '../context/NotificationContext';
import PusherLaunchCard from './PusherLaunchCard';

const AllLaunchs = () => {
    const dispatch = useDispatch();
    const isOn = useSelector((state) => state.animation.isOn);
    const { coins, status, error } = useSelector((state) => state.coins);
    const deployedCoins = useSelector(selectDeployedCoins);
    const createdCoins = useSelector(selectCreatedCoins);
    const filteredCoins = useSelector(selectFilteredCoins);
    const [activeTab, setActiveTab] = useState('AllLaunches');
    const [sortOption, setSortOption] = useState('');
    const blockChain = localStorage.getItem("blockchain")

    const { createNotifications, createNotificationsEth } = useNotificationContext();
    const createNotificationWithBlockChain = blockChain === "SOL" ? createNotifications : createNotificationsEth;

    const hasCreateNotificationData = Object.keys(createNotificationWithBlockChain).length > 0;
    const checkNewPusherTokenStatus = createNotificationWithBlockChain?.status;



    // if (hasCreateNotificationData) {
    //     filteredCoins.unshift(createNotifications);

    //     checkNewPusherTokenStatus === 'deployed' ? deployedCoins.unshift(createNotifications) : checkNewPusherTokenStatus === 'created' ? createdCoins.unshift(createNotifications) : ""


    // }

    // const [pusherNewToken, setPusherNewToken] = useState({});

    console.log("createNotificationWithBlockChain", createNotificationWithBlockChain)
    console.log("errorerrorerror", error)
    console.log("filteredCoins", filteredCoins)
    console.log("deployedCoins", deployedCoins)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoins(sortOption));
        }
    }, [status, dispatch, sortOption]);

    const handleTabClick = (tab) => setActiveTab(tab);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        dispatch(fetchCoins(e.target.value));
    };



    console.log("pusherNewToken", createNotificationWithBlockChain)

    return (
        <div className='p-2 md:p-4 !pb-[150px]'>
            <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div className='flex items-center gap-3'>
                    <div className="win2000-sort-select-container">
                        <select
                            className="win2000-sort-select"
                            value={activeTab}
                            onChange={(e) => handleTabClick(e.target.value)}
                        >
                            <option value="AllLaunches">All Launches</option>
                            <option value="Revealed">Revealed</option>
                            <option value="Hidden">Hidden</option>
                        </select>
                    </div>

                    <AnimationToggle />

                </div>


                <div className='flex items-end gap-2 mt-4 md:mt-0'>
                    {/* <div>
                        <button onClick={() => handleTabClick('AllLaunches')} className="themeBtn PixelOperatorbold">
                            <span>All Launches</span>
                        </button>
                    </div> */}

                    <div className="win2000-sort-select-container">
                        <select className="win2000-sort-select" value={sortOption} onChange={handleSortChange}>
                            <option value="">Sort: Featured</option>
                            <option value="last_reply">Sort: Last Reply</option>
                            <option value="reply_count">Sort: Reply Count</option>
                            <option value="market_cap">Sort: Market Cap</option>
                            <option value="createdAt">Sort: Creation Time</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {activeTab === 'AllLaunches' && (
                    <>
                        {/* {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>} */}
                        {status === 'succeeded' && (
                            filteredCoins.length === 0 && Object.keys(createNotificationWithBlockChain).length === 0 ? (
                                <div>No data found</div>
                            ) : (
                                <>
                                    {Object.keys(createNotificationWithBlockChain).length > 0 && sortOption === '' && (
                                        <PusherLaunchCard pusherData={createNotificationWithBlockChain} />
                                    )}

                                    {filteredCoins
                                        .filter((coin) =>
                                            Object.keys(createNotificationWithBlockChain).length === 0 ||
                                            createNotificationWithBlockChain.token_id !== coin?.coin?._id
                                        )
                                        .map((coin, index) => (
                                            <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                        ))}
                                </>
                            )
                        )}

                        {status === 'failed' && <div>No Coin Found</div>}
                    </>
                )}
                {activeTab === 'Revealed' && (
                    <>
                        {/* {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>} */}
                        {status === 'succeeded' &&
                            (
                                deployedCoins.length === 0 ? (
                                    <div>No data found</div>
                                ) : (
                                    <>
                                        {Object.keys(createNotificationWithBlockChain).length > 0 && createNotificationWithBlockChain.status === "deployed" && (
                                            <PusherLaunchCard pusherData={createNotificationWithBlockChain} />
                                        )}
                                        {
                                            deployedCoins.map((coin, index) => (
                                                <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                            ))}
                                    </>
                                )
                            )}
                        {status === 'failed' && <div>Error: {error}</div>}
                    </>
                )}
                {activeTab === 'Hidden' && (
                    <>
                        {/* {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>} */}
                        {status === 'succeeded' &&
                            (
                                createdCoins.length === 0 ? (
                                    <div>No data found</div>
                                ) : (
                                    <>
                                        {Object.keys(createNotificationWithBlockChain).length > 0 && createNotificationWithBlockChain.status === "created" && (
                                            <PusherLaunchCard pusherData={createNotificationWithBlockChain} />
                                        )}
                                        {
                                            createdCoins.map((coin, index) => (
                                                createNotificationWithBlockChain.token_id !== coin?.coin?._id ? (
                                                    <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                                ) : null
                                            ))
                                        }
                                        {/* {
                                            createdCoins.map((coin, index) => (
                                                <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                            ))} */}
                                    </>
                                )
                            )}
                        {status === 'failed' && <div>Error: {error}</div>}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllLaunchs;
