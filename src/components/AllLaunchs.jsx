import React, { useState } from 'react'
import WindowDropdown from './WindowDropdown/WindowDropdown'
import LaunchCard from './LaunchCard'

const AllLaunchs = () => {
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState('Revealed');

    // Function to handle tab changes
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='p-4'>

            {/* Tab buttons */}
            <div className="flex justify-between items-center mb-4">

                <div className="space-x-2">
                    {/* Revealed Tab */}
                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'Revealed' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('Revealed')}
                    >
                        Revealed
                    </button>

                    {/* Hidden Tab */}
                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'Hidden' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('Hidden')}
                    >
                        Hidden
                    </button>

                    {/* New Tab */}
                    <button
                        className={`Inter rounded-xl text-[15px] text-white px-4 py-2 ${activeTab === 'New' ? 'bg-[#7539F4]' : 'bg-[#7539f466]'}`}
                        onClick={() => handleTabClick('New')}
                    >
                        New
                    </button>
                </div>

                {/* Center button */}
                <div>
                    <button className="themeBtn PixelOperator">
                        <span>All Launches</span>
                    </button>
                </div>

                {/* Right dropdown */}
                <div>
                    <WindowDropdown />
                </div>
            </div>

            {/* Content based on active tab */}
            <div className='grid grid-cols-3 gap-2'>
                {activeTab === 'Revealed' && (
                    <>
                        <LaunchCard setSpace="medium" />
                        <LaunchCard setSpace="medium" />
                        <LaunchCard setSpace="medium" />
                        <LaunchCard setSpace="medium" />
                        <LaunchCard setSpace="medium" />
                        <LaunchCard setSpace="medium" />
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
    )
}

export default AllLaunchs;
