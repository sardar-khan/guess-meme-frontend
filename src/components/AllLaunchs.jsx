import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from './LaunchCard';
import { fetchCoins, selectDeployedCoins, selectCreatedCoins, selectFilteredCoins } from '../features/coinSlice';
import AnimationToggle from './AnimationToggle';
import { useNotificationContext } from '../context/NotificationContext';
import PusherLaunchCard from './PusherLaunchCard';
import Pagination from './Pagination';

const AllLaunchs = () => {
    const dispatch = useDispatch();
    const { coins, status, error } = useSelector((state) => state.coins);
    const deployedCoins = useSelector(selectDeployedCoins);
    const createdCoins = useSelector(selectCreatedCoins);
    const filteredCoins = useSelector(selectFilteredCoins);
    const [activeTab, setActiveTab] = useState('AllLaunches');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const coinsPerPage = 18;

    const blockChain = localStorage.getItem("blockchain");
    const { createNotifications, createNotificationsEth } = useNotificationContext();
    const createNotificationWithBlockChain = blockChain === "SOL" ? createNotifications : createNotificationsEth;

    const hasCreateNotificationData = Object.keys(createNotificationWithBlockChain).length > 0;

    // Calculate the index of the first and last coin to display on the current page
    const indexOfLastCoin = currentPage * coinsPerPage;
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
    const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

    // Handle next and previous page changes
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredCoins.length / coinsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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

    return (
        <div className='p-2 md:p-4 !pb-[50px]'>
            <div className="w-full flex md:flex-row md:justify-between md:items-center items-start justify-between space-x-3 mb-4">
                <div className='sm:flex items-center gap-3'>
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
                <div className='flex items-end gap-2 md:mt-4'>
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

            {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>}

            {/* Content based on active tab */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-10'>
                {activeTab === 'AllLaunches' && (
                    <>
                        {status === 'succeeded' && (
                            filteredCoins.length === 0 && Object.keys(createNotificationWithBlockChain).length === 0 ? (
                                <div>No data found</div>
                            ) : (
                                <>
                                    {Object.keys(createNotificationWithBlockChain).length > 0 && sortOption === '' && (
                                        <PusherLaunchCard pusherData={createNotificationWithBlockChain} />
                                    )}

                                    {currentCoins
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
                        {status === 'succeeded' && deployedCoins.length === 0 ? (
                            <div>No data found</div>
                        ) : (
                            <>
                                {deployedCoins.map((coin, index) => (
                                    <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                ))}
                            </>
                        )}
                        {status === 'failed' && <div>Error: {error}</div>}
                    </>
                )}
                {activeTab === 'Hidden' && (
                    <>
                        {status === 'succeeded' && createdCoins.length === 0 ? (
                            <div>No data found</div>
                        ) : (
                            <>
                                {createdCoins.map((coin, index) => (
                                    <LaunchCard key={index} setSpace="medium" coinData={coin} />
                                ))}
                            </>
                        )}
                        {status === 'failed' && <div>Error: {error}</div>}
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCoins.length / coinsPerPage)}
                prevPage={prevPage}
                nextPage={nextPage}
            />
        </div>
    );
};

export default AllLaunchs;
