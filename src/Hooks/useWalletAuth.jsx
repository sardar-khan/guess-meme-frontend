// hooks/useWalletAuth.js
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiInstance } from "../utils/backend/axiosConfig"
import { useNavigate } from 'react-router-dom';


export const useWalletAuth = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // appkit hook for checkng conectivity status

    //call the function when user gets connected with the account


    // Get stored auth data
    const getStoredAuth = useCallback(() => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            return { token, user };
        } catch (err) {
            return { token: null, user: null };
        }
    }, []);

    // Set auth data
    const setAuthData = useCallback((token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Set axios default header
        apiInstance.defaults.headers.common['x-access-token'] = token;
    }, []);

    // Clear auth data
    const clearAuthData = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiInstance.defaults.headers.common['x-access-token'];
    }, []);

    // Handle authentication (both signup and signin)
    const handleAuth = useCallback(async (address, blockchain) => {
        setIsLoading(true);
        setError(null);

        try {
            // First, request nonce
            const authResponse = await apiInstance.post('user/register', {
                address,
                blockchain
            });
            // You'll need to implement the actual signing based on your wallet provider
            // This is an example using ethers.js
            // const signature = await window.ethereum.request({
            //     method: 'personal_sign',
            //     params: [message, address]
            // });

            // // Verify signature and authenticate
            // const authResponse = await apiInstance.post('/auth/verify', {
            //     address,
            //     checkBlockChain
            // });
            if (authResponse?.status === 200) {

                const token = authResponse.data.data.token;
                const user = authResponse.data.data;
                //console.log("usersss", token, user)
                // Store auth data
                setAuthData(token, user);

                // Show success message




                return {
                    data: authResponse.data,
                    error: false
                }
            } else {
                return {
                    data: null,
                    error: true

                }
            }



        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Authentication failed';
            setError(errorMessage);
            toast.error(errorMessage, { autoClose: 3000 });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setAuthData, navigate]);

    // Logout
    const logout = useCallback(async (disconnect) => {
        try {
            clearAuthData();
            // Disconnect wallet if function provided
            if (disconnect) {
                await disconnect();
            }
            // Navigate to home
            navigate('/');
            toast.success('Logged out successfully');
        } catch (err) {
            console.error('Logout error:', err);
        }
    }, [clearAuthData, navigate]);

    // Check auth status
    const checkAuth = useCallback(async () => {
        const { token, user } = getStoredAuth();

        if (!token || !user) {
            return false;
        }

        try {
            // Verify token is still valid
            await apiInstance.get('/auth/verify-token');
            return true;
        } catch (err) {
            clearAuthData();
            return false;
        }
    }, [getStoredAuth, clearAuthData]);

    return {
        handleAuth,
        logout,
        checkAuth,
        isLoading,
        error,
        getStoredAuth
    };
};

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
};