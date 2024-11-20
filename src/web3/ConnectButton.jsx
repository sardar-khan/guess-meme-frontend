// ConnectButton.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import logo from '../assets/logo.png';
import { handleSignUp } from '../utils/api';
import { toast } from 'react-toastify';

const ConnectButton = () => {
    const { connected, publicKey, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [connectedAddress, setConnectedAddress] = useState('');

    // console.log("token", localStorage.getItem('token'))
    // Handle the wallet sign-up and authentication
    const handleSignin = useCallback(async () => {
        try {
            if (connected && publicKey) {
                const address = publicKey.toString();
                const response = await handleSignUp(address, 'solana');
                if (response?.status === 201 || response?.status === 200) {
                    toast.success(response.message, { autoClose: 1000 });
                    console.log("Authentication:", response.message);
                    setConnectedAddress(address);
                }
            }
        } catch (error) {
            disconnect();
            console.error('Error connecting wallet:', error);
            toast.error('Failed to connect wallet.', { autoClose: 1000 });
        }
    }, [connected, publicKey, disconnect]);

    // Manage the connection state
    useEffect(() => {
        if (connected && publicKey) {
            const address = publicKey.toString();
            setConnectedAddress(address);
            if (!localStorage.getItem('token')) {
                handleSignin();
            }
        } else {
            setConnectedAddress('');
            localStorage.removeItem('token');
        }
    }, [connected, publicKey, handleSignin]);

    const handleConnectClick = () => {
        if (connected) {
            disconnect();
        } else {
            setVisible(true);
        }
    };

    return (
        <div className='connectBtn flex items-center w-[190px] cursor-pointer' onClick={handleConnectClick}>
            <img src={logo} className='w-[40px] h-[40px]' alt="Logo" />
            <h2 className='SegoeUi'>
                {connectedAddress ? (
                    <span>{`${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`}</span>
                ) : (
                    'Connect Wallet'
                )}
            </h2>
        </div>
    );
};

export default ConnectButton;
