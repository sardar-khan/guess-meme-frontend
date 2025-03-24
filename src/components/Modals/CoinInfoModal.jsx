import React from 'react';

const CoinInfoModal = ({ isOpen, setIsOpen, activeTab }) => {
    const infoText = activeTab === 'created'
        ?
        'This section contains information about hidden coins. When a coin is created, it is initially hidden. Users can see that a new coin has been created, but its details (such as name, image, and metadata) remain undisclosed until the reveal time set by the owner expires. Despite being hidden, users can still trade the coin.'
        :
        'This section contains information about revealed coins. After the owner sets a reveal time (such as 5 min, 15 min, 30 min, 1hr, 2hr, or 24hr), the coin details will become visible to all users once the selected time has elapsed. This includes its name, image, and other data. Users can trade the coin even before it is revealed.';

    return (
        <div
            className='fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center'
            onClick={() => setIsOpen(false)}
        >
            <div
                className='borderShade-2 bg-[#A49DD2] p-5 w-[90%] max-w-lg'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-bold mb-3'>{activeTab === 'deployed' ? 'Revealed' : 'Hidden'} Coin Info</h3>
                <div className='p-3 bg-[#ffffffc5] borderShade'>
                    {activeTab === 'created' ?
                        <p className='fontsemibold text-black'>
                            This section contains information about hidden coins. When a coin is created, it is initially hidden. Users can see that a new coin has been created, but its details (such as name, image, and metadata) remain undisclosed until the reveal time set by the owner expires. Despite being hidden, users can still trade the coin.
                        </p>
                        :
                        <p className='fontsemibold text-black'>
                            This section contains information about revealed coins. After the owner sets a reveal time (such as 5 min, 15 min, 30 min, 1hr, 2hr, or 24hr), the coin details will become visible to all users once the selected time has elapsed. This includes its name, image, and other data. Users can trade the coin even before it is revealed.
                        </p>
                    }
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className='themeBtn w-fit mt-6 mx-auto'
                >
                    <span className='!text-sm'>
                        Close
                    </span>
                </button>
            </div>
        </div>
    );
};

export default CoinInfoModal;
