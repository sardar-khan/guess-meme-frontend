

import React, { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import logo from '../assets/logo.png';

const ConnectButton = () => {
    const { open, close } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const [connectedAddress, setConnectedAddress] = useState('');


    const { disconnect } = useDisconnect()


    useEffect(() => {
        if (isConnected && address) {
            setConnectedAddress(address);
        } else {
            setConnectedAddress('');
        }
    }, [isConnected, address]);


    return (



        <div className='connectBtn flex items-center w-[275px] cursor-pointer' onClick={() => open()}>
            <img src={logo} className='w-[55px] h-[55px]' alt="Logo" />
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
