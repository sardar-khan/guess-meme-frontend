import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';



const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    // const [responseStatus, setResponseStatus] = useState(false);
    const [status, setStatus] = useState(false)
    const [account, setAccount] = useState();
    const [checkSignature, setCheckSignature] = useState(false);
    const { isConnected, address } = useAccount();
    const [connectedAddress, setConnectedAddress] = useState('');

    useEffect(() => {
        if (isConnected && address) {
            setConnectedAddress(address);
        } else {
            setConnectedAddress('');
        }
    }, [isConnected, address]);

    return (
        <WalletContext.Provider value={{ status, setStatus, connectedAddress, checkSignature, setCheckSignature }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);