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

//viewCoins function
export const viewCoins = async () => {
    try {
        const response = await apiInstance.get('user/view-coins');
        console.log('ViewCoins', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
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
export const submitComment = async ({ text, token_id, image }) => {
    try {
        const response = await apiInstance.post('thread/post', {
            text,
            token_id,
            image,
        });
        console.log('submitComment', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to post comment');
    }
};