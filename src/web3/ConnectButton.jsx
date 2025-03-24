
// ConnectButton.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitState } from "@reown/appkit/react";
import { useDisconnect } from '@reown/appkit/react'

import logo from '../assets/logo.png';
import { handleSignUp } from '../utils/api';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/useAuth';

const ConnectButton = () => {
    const { address, isConnected } = useAppKitAccount()
    const { disconnect } = useDisconnect()
    const { open, close } = useAppKit()
    const { isAuthenticated, user ,logoutUser,setLogoutUser} = useAuthContext()
   
    const [connectedAddress, setConnectedAddress] = useState('');
  
    const blockchain = localStorage.getItem('blockchain')
 
    const checkBlockChain =
        blockchain === 'SOL' ? 'solana' : 'sepolia';


    if (checkBlockChain === null) {
        disconnect();
    }



    // Handle the wallet sign-up and authentication
    const handleSignin = useCallback(async () => {
        try {
            if (!isConnected) return toast.error("Wallet address not connected");
            if (!address) return toast.error("Wallet Address is not valid")
            if (isConnected && address) {

                const response = await handleSignUp(address, checkBlockChain);

                if (response?.status === 201 || response?.status === 200) {
                    // toast.success(response.message, { autoClose: 1000 });

                }
            }
        } catch (error) {
            await disconnect();
            console.error('Error connecting wallet:', error);
            // toast.error('Failed to connect wallet.', { autoClose: 1000 });
        }
    }, [isConnected, address]);


    const handleConnectClick = () => {
        if (address) {
            open();
        } else {
            open();
        }
    };




    return (
        <div className='themeBtn2 flex items-center cursor-pointer' onClick={handleConnectClick}>
            <span className=''>
                <h2 className='!text-[18px] font-bold PixelOperatorbold'>
                    {address ? (
                        <span className='!text-[18px]'>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    ) : (
                        'Connect Wallet'
                    )}
                </h2>
            </span>
        </div>


    );
};

export default ConnectButton;


