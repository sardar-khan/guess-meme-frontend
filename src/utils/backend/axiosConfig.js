import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const blockchain = localStorage.getItem("blockchain")
export const checkBlockChain =
    blockchain === 'SOL' ? 'solana' :
        blockchain === 'ETH' ? 'sepolia' :
            blockchain === 'POL' ? 'polygon' :
                blockchain === 'BNB' ? 'bsc' :
                    blockchain === null ? 'solana' :
                        'solana';

export const apiInstance = axios.create({
    baseURL: apiUrl,
});

// Interceptor to attach the token in headers for every request
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
