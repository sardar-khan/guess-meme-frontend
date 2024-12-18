import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from './LaunchCard';
import { fetchCoins, selectDeployedCoins, selectCreatedCoins, selectFilteredCoins } from '../features/coinSlice';
import AnimationToggle from './AnimationToggle';
import Pusher from 'pusher-js';

const AllLaunchs = () => {
    const dispatch = useDispatch();
    const { coins, status, error } = useSelector((state) => state.coins);
    const deployedCoins = useSelector(selectDeployedCoins);
    const createdCoins = useSelector(selectCreatedCoins);
    const filteredCoins = useSelector(selectFilteredCoins);
    const [activeTab, setActiveTab] = useState('AllLaunches');
    const [sortOption, setSortOption] = useState('');


    const [pusherNewToken, setPusherNewToken] = useState();


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



    useEffect(() => {
        // Configure Pusher client
        const pusher = new Pusher(`c2c6e8d77a411d6cc315`, {
            cluster: `ap2`,
        });

        // Subscribe to the channel
        const coinchannal = pusher.subscribe('coin-created-channel');

        coinchannal.bind('coin-created', (data) => {

            console.log("Puser New Coin Created:", data);
            setPusherNewToken({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                token_address: data.token_address,
                user_image: data.user_image,
                date: date,
                replies: replies,
                ticker: ticker,
                token_id: token_id,
            });

        });


        return () => {
            coinchannal.unbind_all();
            coinchannal.unsubscribe();
        };
    }, []);

    console.log("pusherNewToken", pusherNewToken)

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
                            filteredCoins.length === 0 ? (
                                <div>No data found</div>
                            ) : (
                                filteredCoins.map((coin, index) => (
                                    <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                ))
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
                                    deployedCoins.map((coin, index) => (
                                        <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                    ))
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
                                    createdCoins.map((coin, index) => (
                                        <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                    ))
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
