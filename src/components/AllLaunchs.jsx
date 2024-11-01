import React, { useState, useEffect } from 'react';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import LaunchCard from './LaunchCard';
import { viewCoins } from '../utils/api';

const AllLaunchs = () => {
    const [activeTab, setActiveTab] = useState('Revealed');
    const [coins, setCoins] = useState([]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const data = await viewCoins();
                console.log('Fetched coins:', data.data);
                setCoins(data.data);
            } catch (error) {
                console.error('Error fetching coins:', error);
            }
        };

        fetchCoins();
    }, []);

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
                        {coins.map((coin, index) => (
                            <LaunchCard key={index} setSpace="medium" coinData={coin} />
                        ))}
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
