import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from './LaunchCard';
import { fetchCoins, selectDeployedCoins, selectAllCoins, selectCreatedCoins, selectFilteredCoins } from '../features/coinSlice';
import AnimationToggle from './AnimationToggle';
import { useNotificationContext } from '../context/NotificationContext';
import PusherLaunchCard from './PusherLaunchCard';
import Pagination from './Pagination';
import { useWalletContext } from '../context/WalletContext';
import { calculateBondingCurveProgresstest, testPumpFunTokenBondingCurve } from '../web3/testFunctions';
import { reteriveTokenDetails } from './PlaceTrade/solanaBuySellFunction';
import { FaInfoCircle } from 'react-icons/fa';
import CoinInfoModal from './Modals/CoinInfoModal';
import axios from 'axios';

const AllLaunchs = () => {
    const dispatch = useDispatch();
    const { coins, status, error } = useSelector((state) => state.coins);
    const deployedCoins = useSelector(selectDeployedCoins);
    const createdCoins = useSelector(selectCreatedCoins);
    const allCoins = useSelector(selectAllCoins);
    const filteredCoins = useSelector(selectFilteredCoins);
    const [coinsTab, setCoinTab] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Modal State
    const [isOpen, setIsOpen] = useState(false);
    // Modal function
    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);

    const coinsPerPage = 50;
    const { block_chain } = useWalletContext();
    const searchType = block_chain === "SOL" ? "solana" : "sepolia";
    console.log("block_chain", block_chain)

    const { createNotifications, createNotificationsEth } = useNotificationContext();
    // const createNotificationWithblock_chain = block_chain === "SOL" ? createNotifications : createNotificationsEth;

    // const hasCreateNotificationData = Object.keys(createNotificationWithblock_chain).length > 0;
    const createNotificationWithBlockChain = block_chain === "SOL" ? createNotifications : createNotificationsEth;

    const hasCreateNotificationData = Object.keys(createNotificationWithBlockChain).length > 0;

    // Calculate the index of the first and last coin to display on the current page
    const indexOfLastCoin = currentPage * coinsPerPage;
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;

    // Use searchResults when search is active (only in deployed tab), otherwise use filteredCoins
    // const displayCoins = isSearchActive && (activeTab === 'deployed' || activeTab === 'all') ?
    //     searchResults.slice(indexOfFirstCoin, indexOfLastCoin) :
    //     filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
    const displayCoins = isSearchActive && searchResults.length > 0 && (activeTab === 'deployed' || activeTab === 'all')
        ? searchResults.slice(indexOfFirstCoin, indexOfLastCoin)
        : filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

    // Total number of coins for pagination calculation
    const totalCoins = isSearchActive && (activeTab === 'deployed' || activeTab === 'all') ?
        searchResults.length :
        filteredCoins.length;

    // Handle next and previous page changes
    const nextPage = () => {
        if (currentPage < Math.ceil(totalCoins / coinsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if (activeTab === 'all') {
            dispatch(fetchCoins({ sortBy: "all", coinSorting: "last_reply" }));
        }
    }, [activeTab]);

    // Reset pagination when active tab changes
    useEffect(() => {
        setCurrentPage(1);
        setIsSearchActive(false); // Reset search state when tab changes
    }, [activeTab]);

    const handleTabClick = (tab) => setActiveTab(tab);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        dispatch(fetchCoins({ sortBy: activeTab, coinSorting: e.target.value }));
    };

    const handleTabChange = (e) => {
        handleTabClick(e.target.value);
        dispatch(fetchCoins({ sortBy: e.target.value, coinSorting: "" }));
        setSearchTerm(''); // Clear search when switching tabs
        setIsSearchActive(false); // Reset search active state
    };

    const handleSearch = async () => {
        console.log("Searching for:", searchTerm);
        if (!searchTerm) {
            setIsSearchActive(false);
            setSearchResults([]); // Reset search results
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}user/token-details/${searchTerm}?type=${searchType}`
            );

            if (response?.status === 200) {
                console.log('search results:', response?.data?.data);
                setSearchResults(response?.data?.data);
                setIsSearchActive(true);
                setCurrentPage(1);
            } else {
                setSearchResults([]);
                setIsSearchActive(true);
                console.error("Search API Error:", response.data.message);
            }
        } catch (error) {
            setSearchResults([]);
            setIsSearchActive(true);
            console.error("Search Request Failed:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (activeTab === 'deployed' || activeTab === 'all')) {
            handleSearch();
        }
    };

    useEffect(() => {
        if (searchTerm === '') {
            handleSearch()
        }
    }, [searchTerm])


    console.log("searchResults", searchResults);
    console.log("isSearchActive", isSearchActive);

    return (
        <div className='pb-2 md:pb-[50px] md:px-4'>
            <div className='flex items-center justify-center'>
                <div className='flex items-center justify-center gap-1 w-full max-w-[516px]'>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={activeTab === 'deployed' || activeTab === 'all' ? 'Search by coin name' : ''}
                        disabled={activeTab !== 'deployed' && activeTab !== 'all'}
                        className={`text-center p-[5px] mt-2 w-full border-[4px] border-[#efefef] border-l-[#4C4C4C] border-t-[#C0C0C0] ${activeTab !== 'deployed' && activeTab !== 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={activeTab !== 'deployed' && activeTab !== 'all'}
                        className={`themeBtn w-fit min-w-fit text-[12px] h-full text-white px-4 py-2 mt-1 ${activeTab !== 'deployed' && activeTab !== 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className='!text-[12px]'>Search</span>
                    </button>
                </div>
            </div>

            <div className="w-full flex md:flex-row md:justify-between md:items-center items-start justify-between space-x-3 mb-4">
                <div className='sm:flex items-center gap-3'>
                    <div className='sm:flex items-center gap-1'>
                        <div className="win2000-sort-select-container firstone">
                            <select
                                className="win2000-sort-select"
                                value={activeTab}
                                onChange={handleTabChange}
                            >
                                <option value="all">All Coins</option>
                                <option value="deployed">Revealed</option>
                                <option value="created">Hidden</option>
                            </select>
                        </div>
                        <div
                            className='themeBtn flex justify-center items-center !w-[46px] min-w-[46px] !h-[46px] cursor-pointer'
                            onClick={handleOpenModal}
                        >
                            <span>
                                <FaInfoCircle className='text-white text-lg' />
                            </span>
                        </div>
                        {isOpen && (
                            <CoinInfoModal
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                activeTab={activeTab}
                            />
                        )}
                    </div>
                    <AnimationToggle />
                </div>
                <div className='flex items-end gap-2 md:mt-4'>
                    <div className="win2000-sort-select-container secondone">
                        <select className="win2000-sort-select " value={sortOption} onChange={handleSortChange}>
                            <option value="">Sort: Featured</option>
                            <option value="last_reply">Sort: Last Reply</option>
                            <option value="reply_count">Sort: Reply Count</option>
                            <option value="market_cap">Sort: Market Cap</option>
                            <option value="createdat" >Sort: Creation Time</option>
                        </select>
                    </div>
                </div>
            </div>

            {status === 'loading' && <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>}

            {/* Content based on active tab and search */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-10'>
                {/* {activeTab === 'AllLaunches' && (
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
                )} */}






                {isSearchActive && (activeTab === 'deployed' || activeTab === 'all') ? (
                    searchResults.length === 0 ? (
                        <div className="col-span-3 text-center py-6">No matching tokens found</div>
                    ) : (
                        displayCoins.map((coin, index) => (
                            <LaunchCard
                                key={coin?.coin?._id || index}
                                setSpace="medium"
                                coinData={coin}
                                status={activeTab}
                            />
                        ))
                    )
                ) : (
                    <>
                        {activeTab === 'deployed' && (
                            <>
                                {status === 'succeeded' && deployedCoins.length === 0 ? (
                                    <div className="col-span-3 text-center py-6">No data found</div>
                                ) : (
                                    <>
                                        {deployedCoins.slice(indexOfFirstCoin, indexOfLastCoin).map((coin, index) => (
                                            <LaunchCard
                                                key={coin?.coin?._id || index + "deployed"}
                                                setSpace="medium"
                                                coinData={coin}
                                                status="deployed"
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'created' && (
                            <>
                                {status === 'succeeded' && createdCoins.length === 0 ? (
                                    <div className="col-span-3 text-center py-6">No data found</div>
                                ) : (
                                    <>
                                        {createdCoins.slice(indexOfFirstCoin, indexOfLastCoin).map((coin, index) => (
                                            <LaunchCard
                                                id={index + "created"}
                                                key={coin?.coin?._id || index + "created"}
                                                setSpace="medium"
                                                coinData={coin}
                                                status="created"
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'all' && (
                            <>
                                {status === 'succeeded' && allCoins.length === 0 ? (
                                    <div className="col-span-3 text-center py-6">No data found</div>
                                ) : (
                                    <>
                                        {allCoins.slice(indexOfFirstCoin, indexOfLastCoin).map((coin, index) => (
                                            <LaunchCard
                                                id={index + "all"}
                                                key={coin?.coin?._id || index + "all"}
                                                setSpace="all"
                                                coinData={coin}
                                                status="all"
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCoins / coinsPerPage)}
                prevPage={prevPage}
                nextPage={nextPage}
            />
        </div>
    );
};

export default AllLaunchs;