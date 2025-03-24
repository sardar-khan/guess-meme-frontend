import { createContext, useContext, useEffect, useState } from 'react';
import { useWalletAuth } from '../Hooks/useWalletAuth';
import { useAppKitAccount } from '@reown/appkit/react';
import { useDisconnect } from '@reown/appkit/react'
import { checkBlockChain } from '../utils/backend/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const { disconnect } = useDisconnect()
    const [logoutUser, setLogoutUser] = useState(false);
    const {  getStoredAuth, handleAuth } = useWalletAuth();
    const { address, isConnected } = useAppKitAccount()



    useEffect(() => {
        //only call when address is along with is connected true
        if (isConnected && address && checkBlockChain) {

            handleSession()
        }
    }, [address, isConnected, checkBlockChain])



    const handleSession = async () => {
        try {
            // console.log("handled")
            const res = await handleAuth(address, checkBlockChain);

            if (res?.error) {
                setIsAuthenticated(false)
                disconnect();
            } else {
                //initialize userDD
                setIsAuthenticated(true)
                initAuth()
            }
        } catch (error) {
            console.log("error while handling session", error)
        }
    }

    const initAuth = async () => {
        const { user } = getStoredAuth();
        setUser(user);
    };
    console.log("logs--users--",user)

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser, logoutUser, setLogoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);


