import React, { useEffect, useState } from 'react';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import logo from '../assets/logo.png';
import burger from '../assets/icons/burger.png';
import userprofile from '../assets/images/userprofile.png';
import img from '../assets/images/Group 159.png'

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DirectBuy from './DirectBuy';
import ConnectButton from '../web3/ConnectButton';
// import Pusher from 'pusher';
import Pusher from 'pusher-js';
import { getLatestNotifications } from '../utils/api';
import { useNotificationContext } from '../context/NotificationContext';


const Navbar = () => {
    const isOn = useSelector((state) => state.animation.isOn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [notifications, setNotifications] = useState({});
    // const [createNotifications, setCreateNotifications] = useState({});
    const [latestnotifications, setLatestNotifications] = useState([]);
    const { notifications, createNotifications } = useNotificationContext();


    const formatDate = (dateString) => {
        if (!dateString) return ""; // Handle undefined or null case
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month starts from 0
        const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of year
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getLatestNotifications();
                setLatestNotifications(data?.data);
            } catch (err) {
                console.log("Failed to fetch notifications. Please try again later.");
            }
        };

        fetchNotifications();
    }, []);
    console.log("latestnotifications", latestnotifications)




    // useEffect(() => {
    //     // Configure Pusher client
    //     const pusher = new Pusher(`c2c6e8d77a411d6cc315`, {
    //         cluster: `ap2`,
    //     });

    //     // Subscribe to the channel
    //     const channel = pusher.subscribe('trades-channel');
    //     const coinchannal = pusher.subscribe('coin-created-channel');

    //     coinchannal.bind('coin-created', (data) => {

    //         console.log("Coin pusher Data Received:", data);

    //         setCreateNotifications({
    //             user_name: data.user_name,
    //             action: data.action,
    //             coin_photo: data.coin_photo,
    //             date: data.date,
    //             replies: data.replies,
    //             ticker: data.ticker,
    //             token_id: data.token_id,
    //         });

    //     });

    //     channel.bind('trade-initiated', (data) => {
    //         // Log the payload to confirm it's an object
    //         console.log("Trade Data Received:", data);

    //         setNotifications({
    //             user_name: data.user_name,
    //             action: data.action,
    //             coin_photo: data.coin_photo,
    //             token_address: data.token_address,
    //             user_image: data.user_image,
    //         });

    //     });


    //     return () => {
    //         channel.unbind_all();
    //         channel.unsubscribe();
    //         coinchannal.unbind_all();
    //         coinchannal.unsubscribe();
    //     };
    // }, [notifications, latestnotifications]);

    console.log("notificationsPusher", notifications)
    console.log("createNotificationsPusher", createNotifications)
    console.log("createNotificationsPusher", createNotifications?.action)

    const hasNotificationData = Object.keys(notifications).length > 0;
    const hasCreateNotificationData = Object.keys(createNotifications).length > 0;
    console.log('hasCreateNotificationData', hasCreateNotificationData)
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    const openDirectModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false)
    };


    return (
        <div className='px-1 sm:px-2 primary-bg'>
            <div className='flex items-center justify-between px-0 py-2'>
                {/* Logo Section */}
                <div className='flex items-end gap-3'>
                    <Link to='/' className='flex items-center'>
                        <img src={logo} className='w-[40px] sm:w-[30px] mt-[-4px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[28px]'>Guess.Meme</h2>
                    </Link>

                    <div className='flex items-center gap-1'>
                        {/* +mnO Buy 23 SOl of climber */}

                        <div class={`${isOn ? 'element-to-shake' : ''} PixelOperatorbold flex items-center gap-1 p-2 text-sm font-semibold rounded bg-white max-[930px]:hidden`}>
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : notifications?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">{!hasNotificationData ? latestnotifications?.latestTrade?.user_name : notifications?.user_name}</Link>
                            {/* Buy */}
                            <Link class="hover:underline" href="/">{!hasNotificationData ? latestnotifications?.latestTrade?.action : notifications?.action}</Link>
                            {/* of climber */}
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_name}` : notifications?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>


                        <div class={`${isOn ? 'element-to-shake' : ''} PixelOperatorbold flex items-center gap-1 p-2 text-sm font-semibold rounded text-white bg-[#5F16BC] max-[930px]:hidden`}>
                            <img src={!hasCreateNotificationData || hasCreateNotificationData === undefined ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_profile}` : createNotifications?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">
                                {!hasCreateNotificationData ? latestnotifications?.latestTrade?.user_name : createNotifications?.user_name}
                            </Link>
                            <Link class="hover:underline" href="/">{!hasCreateNotificationData ? latestnotifications?.latestCoin?.action : createNotifications?.action}</Link>
                            on {formatDate(!hasCreateNotificationData ? latestnotifications?.latestCoin?.date : createNotifications?.date)}
                            <img src={!hasCreateNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : createNotifications?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>

                    </div>

                </div>

                {/* Hamburger Icon for Mobile */}
                <div className='lg:hidden'>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        <img src={burger} alt="" />
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className='hidden lg:flex gap-2 relative z-[999]'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn w-[120px] min-w-[120px] !text-xs uppercase'>
                        <span className='PixelOperatorbold '>Launch Token</span>
                    </Link>
                    {/* <Link to='/editprofile' className='themeBtn w-[35px] min-w-[50px] uppercase'>
                        <span className='mt-[-8px]'>⚡</span>
                    </Link> */}
                    <button
                        className='themeBtn w-[35px] min-w-[50px] uppercase'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className='mt-[-8px]'>⚡</span>
                    </button>


                    <Link to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                        <span className='PixelOperatorbold'>?</span>
                    </Link>

                    <ConnectButton />
                </div>
            </div>

            {/* Sidebar Menu for Mobile */}
            <div className={`lg:hidden fixed top-0 left-0 w-[260px] h-full bg-[#1a1a1a] z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className='flex justify-between items-center p-4'>
                    <Link to='/' className='flex items-center' onClick={closeMenu}>
                        <img src={logo} className='w-[30px] mb-[-8px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[22px] mt-[10px]'>Guess.Meme</h2>
                    </Link>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        &times;
                    </button>
                </div>
                <div className='flex flex-col gap-4 p-4'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn text-xs uppercase' onClick={closeMenu}>
                        <span className='PixelOperatorbold'>Launch Token</span>
                    </Link>

                    <ConnectButton />
                    <div className='flex gap-2'>
                        <div
                            className='themeBtn w-[35px] min-w-[50px] uppercase'
                            onClick={openDirectModal}
                        >
                            <span className='mt-[-8px]'>⚡</span>
                        </div>
                        <Link onClick={() => setIsMenuOpen(false)} to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                            <span className='PixelOperatorbold'>?</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Background Overlay when Menu is Open */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40"
                    onClick={closeMenu}
                ></div>
            )}
            <DirectBuy
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Navbar;
