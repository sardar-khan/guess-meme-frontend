// utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import SecureLS from 'secure-ls';

// Initialize SecureLS
const ls = new SecureLS({ encodingType: 'aes' });
const apiUrl = import.meta.env.VITE_API_URL;

const apiInstance = axios.create({
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

// handleSignUp function
export const handleSignUp = async (address, blockchain) => {
    try {
        const response = await apiInstance.post('user/register', {
            address,
            blockchain,
        });
        const token = response.data.data.token;

        if (token) {
            localStorage.setItem('token', token);
        }

        return response.data;
    } catch (error) {
        console.error('Error posting wallet address:', error);
        toast.error('Failed to send wallet address.', { autoClose: 1000 });
    }
};

// viewProfile function
export const viewProfile = async () => {
    try {
        const response = await apiInstance.get('user/view-profile');
        console.log('viewProfile', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// editProfile function
export const editProfile = async ({ user_name, bio, profile_photo }) => {
    try {
        const response = await apiInstance.post('user/edit-profile', {
            user_name,
            bio,
            profile_photo,
        });
        console.log('editProfile', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during edit Profile:', error);
        throw error;
    }
};

// viewCoins function
export const viewCoins = async (sortBy = '') => {
    try {
        const url = sortBy ? `user/view-coins?sortBy=${sortBy}` : 'user/view-coins';
        const response = await apiInstance.get(url);
        console.log('ViewCoins', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching coins:', error);
        throw error;
    }
};



//createCoin function
export const createCoin = async ({ name, ticker, description, image, max_supply, twitter_link, telegram_link, website, bonding_curve, max_buy_percentage, fee, timer }) => {
    try {
        const response = await apiInstance.post('user/create-coin', {
            name,
            ticker,
            description,
            image,
            max_supply,
            twitter_link,
            telegram_link,
            website,
            bonding_curve,
            max_buy_percentage,
            fee,
            timer
        });

        console.log('createCoin', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during createCoin:', error);
        throw error;
    }
};


// Function to upload the image
export const uploadImage = async (formData) => {
    try {
        const response = await apiInstance.post('getimageurl', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Image upload failed');
    }
};


// Submit comment function using Axios instance
export const submitComment = async ({ text, token_id, reply_id, image }) => {
    try {
        const response = await apiInstance.post('thread/post', {
            text,
            token_id,
            reply_id,
            image,
        });
        console.log('submitComment', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to post comment');
    }
};

// Submit comment function using Axios instance
export const BuyToken = async ({ account_type, amount, token_amount, token_id, type }) => {
    try {
        const response = await apiInstance.post('trade/initiate', {
            account_type,
            amount,
            token_amount,
            token_id,
            type,
        });
        console.log('BuyToken', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to Buy Token');
    }
};



// KingOfTheHill function
export const KingOfTheHill = async () => {
    try {
        const response = await apiInstance.get('trade/coin_of_hill');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};


// ViewUser
export const ViewUser = async (userId) => {
    try {
        const response = await apiInstance.get(`/user/user-profile`, {
            params: { user_id: userId },
        });
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};



// Fetch top holders data by token address
export const getTopHolders = async (tokenAddress) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}user/top-holders`, {
        token_address: tokenAddress,
    });
    if (response.data.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to fetch top holders");
    }
};



// ViewCoin
export const viewCoin = async (coinId) => {
    try {
        const response = await apiInstance.post(`/user/view-token`, {
            params: { id: coinId },
        });
        return response.data;
    } catch (error) {
        console.error('Error in View Coin:', error);
        throw error;
    }
};