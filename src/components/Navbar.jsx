import React, { useEffect, useState } from 'react';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import logo from '../assets/logo.png';
import burger from '../assets/icons/burger.png';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DirectBuy from './DirectBuy';
import ConnectButton from '../web3/ConnectButton';
import { getLatestNotifications } from '../utils/api';
import { useNotificationContext } from '../context/NotificationContext';
import { useWalletContext } from '../context/WalletContext';
import DirectBuyEth from './DirectBuyEth';
import { FaInstagram, FaRegUser, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { FaTelegramPlane } from 'react-icons/fa';
import { check } from './PlaceTrade/solanaBuySellFunction';
import { fetchTransactionDetails } from './PlaceTrade/ether-trade-utils';
import { useAuthContext } from '../context/useAuth';
import { useAppKitAccount } from '@reown/appkit/react';
import { useDarkMode } from '../context/DarkModeProvider';


const Navbar = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    // Your existing Navbar code

    // Add this button somewhere in your Navbar JSX
    const darkModeButton = (
        <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? (
                // Sun icon for light mode
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 1V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 21V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.22 4.22L5.64 5.64" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.36 18.36L19.78 19.78" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12H23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.22 19.78L5.64 18.36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.36 5.64L19.78 4.22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                // Moon icon for dark mode
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79C20.9075 14.4288 20.3355 16.0183 19.3334 17.3613C18.3313 18.7043 16.9435 19.7382 15.3354 20.3329C13.7273 20.9276 11.9726 21.0612 10.2898 20.7185C8.60697 20.3758 7.0661 19.571 5.83318 18.3989C4.60025 17.2268 3.73367 15.7486 3.32897 14.1184C2.92426 12.4882 2.99947 10.7675 3.53661 9.17913C4.07375 7.59076 5.04803 6.19299 6.34315 5.16339C7.63827 4.13379 9.19371 3.5 10.8 3.5C11.07 3.5 11.34 3.51 11.6 3.54C9.8654 4.98136 8.83968 7.05973 8.73454 9.28979C8.62941 11.5199 9.45425 13.6952 11.0118 15.3033C12.5693 16.9115 14.7305 17.8251 17.0005 17.8113C17.9884 17.8106 18.9674 17.6405 19.89 17.31C20.65 16.07 21.0775 14.6547 21.135 13.2C21.145 13.06 21.15 12.92 21.15 12.79" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </button>
    );



    const blockChain = localStorage.getItem("blockchain")
    const { block_chain } = useWalletContext()
    const { user } = useAuthContext()
    const { isConnected } = useAppKitAccount()
    const isOn = useSelector((state) => state.animation.isOn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [latestnotifications, setLatestNotifications] = useState([]);
    const { notifications, createNotifications, notificationsEth, createNotificationsEth } = useNotificationContext();
    console.log("notifications", notifications)
    console.log("createNotifications", createNotifications)
    //////////////////////// Pusher ////////////////////////
    const notificationWithBlockChain = blockChain === "SOL" ? notifications : notificationsEth;
    const createNotificationWithBlockChain = blockChain === "SOL" ? createNotifications : createNotificationsEth;


    //////////////////////// Pusher////////////////////////

    // const triggerAnimation = notifications || createNotifications || notificationsEth || createNotificationsEth !== "" || undefined || null || [] || {}
    const triggerAnimation =
        (notifications && Object.keys(notifications).length > 0) ||
        (createNotifications && Object.keys(createNotifications).length > 0) ||
        (notificationsEth && Object.keys(notificationsEth).length > 0) ||
        (createNotificationsEth && Object.keys(createNotificationsEth).length > 0);


    const [isShaking, setIsShaking] = useState(false);
    const handleAnimationEnd = () => {
        setIsShaking(false);
    };

    const location = useLocation();

    useEffect(() => {
        toast.dismiss(); // Dismiss all active toasts on route change
    }, [location.pathname]); // Runs every time the route changes

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

            }
        };

        fetchNotifications();
    }, []);

    console.log("latestnotifications", latestnotifications)



    const hasNotificationData = Object.keys(notificationWithBlockChain).length > 0;
    const hasCreateNotificationData = Object.keys(createNotificationWithBlockChain).length > 0;




    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    const openDirectModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false)
    };;

    // useEffect(() => {
    //     if (isOn && Object.keys(triggerAnimation).length > 0 && !isShaking) {
    //         setIsShaking(true);
    //     }
    // }, [isOn, triggerAnimation, isShaking]);
    useEffect(() => {
        if (isOn && triggerAnimation) {
            setIsShaking(true);
        }
    }, [isOn, notifications, createNotifications, notificationsEth, createNotificationsEth]);


    const animationClass = isShaking ? 'element-to-shake' : '';

    console.log("shakaa", notificationWithBlockChain, latestnotifications)


    useEffect(() => {
        if (isShaking) {
            const timer = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isShaking]);


    return (
        <div className='px-1 sm:px-2 primary-bg'>
            <div className='flex items-center justify-between px-0 py-2'>
                {/* Logo Section */}
                <div className='flex items-end gap-1 md:gap-3'>
                    <div className='flex flex-xol'>
                        <Link to='/' className='flex items-center'>
                            <img src={logo} className='w-[40px] sm:w-[30px] mt-[-4px]' alt="Logo" />
                            <h2 className='PixelOperatorbold text-white font-extrabold !text-[28px] max-[720px]:hidden'>Guess.Meme</h2>

                        </Link>
                    </div>

                    {/* <div className='flex items-center gap-1'>

                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : notificationWithBlockChain?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">{!hasNotificationData ? latestnotifications?.latestTrade?.user_name : notificationWithBlockChain?.user_name}</Link>
                            <Link class="hover:underline" href="/">{!hasNotificationData ? latestnotifications?.latestTrade?.action : notificationWithBlockChain?.action}</Link>
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_name}` : notificationWithBlockChain?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>


                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img src={!hasCreateNotificationData || hasCreateNotificationData === undefined ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_profile}` : createNotificationWithBlockChain?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">
                                {!hasCreateNotificationData ? latestnotifications?.latestTrade?.user_name : createNotificationWithBlockChain?.user_name}
                            </Link>
                            <Link class="hover:underline" href="/">{!hasCreateNotificationData ? latestnotifications?.latestCoin?.action : createNotificationWithBlockChain?.action}</Link>
                            on {formatDate(!hasCreateNotificationData ? latestnotifications?.latestCoin?.date : createNotificationWithBlockChain?.date)}
                            <img src={!hasCreateNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : createNotificationWithBlockChain?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>

                    </div> */}
                    <div className="flex items-center gap-1 ">
                        <div
                            className={`${animationClass} PixelOperatorbold tracking-tight md:tracking-normal text-[10px] flex items-center gap-1 py-2 px-1 md:p-2 md:text-xs font-semibold rounded bg-white `}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img
                                src={
                                    !hasNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestTrade?.user_image
                                        }`
                                        :
                                        `${import.meta.env.VITE_API_URL.slice(0, -1)}${notificationWithBlockChain?.user_image
                                        }`

                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                            <Link
                                className="hover:underline  truncate max-w-[150px]"
                                to={`${!hasNotificationData ? `/profile/${latestnotifications?.latestTrade?.user_id}` : `/profile/${notificationWithBlockChain?.user_name}`}`}
                            >
                                {!hasNotificationData
                                    ? latestnotifications?.latestTrade?.user_name
                                    : notificationWithBlockChain?.user_name}
                            </Link>
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                to={`trade/${latestnotifications?.latestTrade
                                    ?.token_id}/${latestnotifications?.latestTrade
                                        ?.token_address}`}
                            >
                                {!hasNotificationData
                                    ? latestnotifications?.latestTrade?.action
                                    : notificationWithBlockChain?.action}
                            </Link>
                            <img
                                src={
                                    !hasNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestTrade?.coin_photo
                                        }`
                                        :
                                        `${import.meta.env.VITE_API_URL.slice(0, -1)}${notificationWithBlockChain?.coin_photo
                                        }`

                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                        </div>

                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded  max-[930px]:hidden bg-white `}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img
                                src={
                                    !hasCreateNotificationData || hasCreateNotificationData === undefined
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_profile

                                        }`
                                        : createNotificationWithBlockChain?.user_profile

                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                            <Link
                                className="hover:underline bounce truncate max-w-[150px]"
                                to={`/profile/${latestnotifications?.latestCoin?.user_id}`}
                            >
                                {!hasCreateNotificationData
                                    ? latestnotifications?.latestCoin?.user_name
                                    : createNotificationWithBlockChain?.user_name}
                            </Link>
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                to={`trade/${latestnotifications?.latestCoin?.token_id}/${latestnotifications?.latestCoin?.token_address}`}
                            >
                                {!hasCreateNotificationData
                                    ? latestnotifications?.latestCoin?.action
                                    : createNotificationWithBlockChain?.action}
                            </Link>
                            on{" "}
                            <span className="truncate max-w-[150px]">
                                {formatDate(
                                    !hasCreateNotificationData
                                        ? latestnotifications?.latestCoin?.date
                                        : createNotificationWithBlockChain?.date
                                )}
                            </span>
                            <img
                                src={
                                    !hasCreateNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo
                                        }`
                                        : createNotificationWithBlockChain?.user_name
                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                        </div>
                    </div>


                </div>


                {/* Hamburger Icon for Mobile */}
                <div className='lg:hidden  flex items-center justify-center '>
                    <button
                        className='text-white w-[40px] md:w-full text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        <img src={burger} alt="" />
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className='hidden lg:flex gap-2 relative z-[999]'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn w-[120px] min-w-[120px] !text-xs uppercase'>
                        <span className='PixelOperatorbold '>Launch Coin</span>
                    </Link>
                    {/* <Link to='/editprofile' className='themeBtn w-[35px] min-w-[50px] uppercase'>
                        <span className='mt-[-8px]'>⚡</span>
                    </Link> */}
                    <button
                        className='themeBtn w-[35px] md:min-w-[50px] uppercase'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className='mt-[-8px]'>⚡</span>
                    </button>


                    <Link to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                        <span className='PixelOperatorbold'>?</span>
                    </Link>

                    {isConnected &&
                        <NavLink
                            to={`/userProfile/${user?._id}`}
                            // className={({ isActive }) => navLinkClass(isActive)}
                            className='themeBtn w-[35px] min-w-[50px] text-xl uppercase '
                        >
                            <span>
                                <FaRegUser />
                            </span>
                        </NavLink>
                    }
                    <div className='themeBtn w-[35px] min-w-[50px] !h-[50px]'>
                        <span>
                            {darkModeButton}
                        </span>
                    </div>
                    <ConnectButton />
                </div>
            </div>

            {/* Sidebar Menu for Mobile */}
            <div className={`lg:hidden fixed top-0 left-0 md:w-[260px] h-full bg-[#1a1a1a] z-[999] transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
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
                        <span className='PixelOperatorbold'>Launch Coin</span>
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
                        {isConnected &&
                            <NavLink
                                to={`/userProfile/${user?._id}`}
                                // className={({ isActive }) => navLinkClass(isActive)}
                                className='themeBtn w-[35px] min-w-[50px] text-xl uppercase '
                            >
                                <span>
                                    <FaRegUser />
                                </span>
                            </NavLink>
                        }
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
            {block_chain !== "SOL" ?
                <DirectBuyEth
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
                : <DirectBuy
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            }


            {/* <button onClick={(async()=>{await fetchTransactionDetails()})}>fghjklkjh</button> */}
        </div>
    );
};

export default Navbar;
