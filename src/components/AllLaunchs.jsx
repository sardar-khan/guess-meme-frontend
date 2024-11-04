import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import LaunchCard from './LaunchCard';
import { fetchCoins } from '../features/coinSlice';

const AllLaunchs = () => {
    const dispatch = useDispatch();
    const { coins, status, error } = useSelector((state) => state.coins);
    const [activeTab, setActiveTab] = React.useState('Revealed');
    console.log("Allcoins", coins)
    console.log("coins_id", coins?.coin?._id)

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoins());
        }
    }, [status, dispatch]);

    return (
        <div className='p-2 md:p-4 !pb-[150px]'>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div className="space-x-2 w-full md:w-[45%]">
                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'Revealed' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('Revealed')}
                    >
                        Revealed
                    </button>

                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'Hidden' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('Hidden')}
                    >
                        Hidden
                    </button>

                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'New' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('New')}
                    >
                        New
                    </button>
                </div>

                <div className='flex justify-between items-center gap-2 w-full md:w-[55%] mt-4 md:mt-0'>
                    <div>
                        <button className="themeBtn PixelOperatorbold">
                            <span>All Launches</span>
                        </button>
                    </div>

                    <div>
                        <WindowDropdown />
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {activeTab === 'Revealed' && (
                    <>
                        {status === 'loading' && <div>Loading...</div>}
                        {status === 'succeeded' && coins.map((coin, index) => (
                            <LaunchCard key={index} setSpace="medium" coinData={coin} />
                        ))}
                        {status === 'failed' && <div>Error: {error}</div>}
                    </>
                )}

                {activeTab === 'Hidden' && (
                    <>
                        {/* Render Hidden content here */}
                        <LaunchCard setSpace="medium" />
                    </>
                )}
                {activeTab === 'New' && (
                    <>
                        {/* Render New content here */}
                        <LaunchCard setSpace="medium" />
                    </>
                )}
            </div>
        </div>
    );
};

export default AllLaunchs;
