// utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import SecureLS from 'secure-ls';
import { apiInstance } from "./backend/axiosConfig"

// Initialize SecureLS
const ls = new SecureLS({ encodingType: 'aes' });
const apiUrl = import.meta.env.VITE_API_URL;
const blockchain = localStorage.getItem("blockchain")

const checkBlockChain =
    blockchain === 'SOL' ? 'solana' :
        blockchain === 'ETH' ? 'sepolia' :
            blockchain === 'POL' ? 'polygon' :
                blockchain === 'BNB' ? 'bsc' :
                    blockchain === null ? 'solana' :
                        'solana';


console.log("baby-hello", checkBlockChain)
// const apiInstance = axios.create({
//     baseURL: apiUrl,
// });

// // Interceptor to attach the token in headers for every request
// apiInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers['x-access-token'] = token;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// handleSignUp function
export const handleSignUp = async (address, blockchain) => {
    try {
        const response = await apiInstance.post('user/register///asdasd', {
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

        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// editProfile function
export const editProfile = async ({ user_name, bio, profile_photo, x_link }) => {
    try {
        const response = await apiInstance.post('user/edit-profile', {
            user_name,
            bio,
            profile_photo,
            x_link
        });
        //  
        return response.data;
    } catch (error) {
        console.error('Error during edit Profile:', error);
        throw error?.response?.data?.message;
    }
};

//update profile settings
export const updateProfileSettings = async ({ value, settingName }) => {
    try {
        const response = await apiInstance.post('user/update-profile-settings', {
            value,
            settingName
        });
        //  
        return response.data;
    } catch (error) {
        console.error('Error during edit Profile:', error);
        throw error?.response?.data?.message;
    }
};

// viewCoins function
export const viewCoins = async ({ sortBy, coinSorting }) => {
    try {

        const url = sortBy ? `user/view-coins?status=${sortBy?.toLowerCase()}&type=${checkBlockChain}&sortBy=${coinSorting?.toLowerCase()}` : `user/view-coins?status=deployed&type=${checkBlockChain}`;
        const response = await apiInstance.get(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching coins:', error);
        throw error;
    }
};

export const kingoftheHill_progress = async (token_address) => {
    try {
        const response = await apiInstance.post('trade/king-of-hill-progress', {
            token_address: token_address
        });
        //  
        return response.data;
    } catch (error) {
        console.error('Error during kingoftheHill_progress:', error);
        throw error;
    }
};


export const Progress_curve_bond = async (token_address) => {
    try {
        const response = await apiInstance.post('trade/progress-curve-bond', {
            token_address: token_address
        });

        return response.data;
    } catch (error) {
        console.error('Error during Progress_curve_bond:', error);
        throw error;
    }
};


//createCoin function
export const createCoin = async ({ name, ticker, description, image, max_supply, twitter_link, telegram_link, website, bonding_curve, max_buy_percentage, amount, timer, hash, dev_buy, bondingCurve, tokenAddress }) => {
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
            amount,
            dev_buy,
            timer,
            hash,
            bonding_curve: bondingCurve,
            token_address: tokenAddress,
        });


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

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to post comment');
    }
};

// Submit comment function using Axios instance
export const BuyToken = async ({ account_type, amount, token_amount, token_id, type, transaction_hash }) => {
    try {
        const response = await apiInstance.post('trade/initiate', {
            account_type,
            amount,
            token_amount,
            token_id,
            type,
            transaction_hash,
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to Buy Token');
    }
};

export const saveDevBuyTrade = async ({ tokenId, dev_buy }) => {
    try {
        const response = await apiInstance.post('user/save-dev-buy', {
            tokenId,
            dev_buy
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to Buy Token');
    }
};

export const getCreatorBuyToken = async (id, creator_id) => {
    try {
        const response = await apiInstance.get(`trade/creator-trade/${id}/${creator_id}`);
        console.log("object", response)
        if (response.data.status === 200) {
            return {
                status: response.data.status,
                "data": response.data?.userTradeSummary?.netTokenAmount
            }
        } else {
            return {
                status: response.data.status,
                "data": null
            }
        }

    } catch (error) {
        console.log("error while get-creator-buy-token", error)
        return {
            status: 404,
            "data": null
        }

    }
}

export const tokenTransferStatus = async (id) => {
    try {
        const response = await apiInstance.get(`user/coin-shifting-status/${id}`);
        console.log("shifting", response);
        if (response.status === 200) {
            return {
                status: response.status,
                "data": response.data?.is_shifted
            }
        } else {
            return {
                status: response.status,
                "data": null
            }
        }

    } catch (error) {
        console.log("error while shiting-token", error)
        return {
            status: 404,
            "data": null
        }

    }
}


// KingOfTheHill function
export const KingOfTheHill = async () => {
    try {
        const response = await apiInstance.get(`trade/coin_of_hill/${checkBlockChain}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching king of the hill  :', error);
        throw error;
        //throw error;
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
        const response = await apiInstance.post(`user/view-token/${coinId} `);


        return response.data;
    } catch (error) {
        console.error('Error in View Coin:', error);
        throw error;
    }
};
export const getCoinByWalletAddress = async (coinId) => {
    try {
        const response = await apiInstance.post(`user/token-details/${coinId} `);


        return response.data;
    } catch (error) {
        console.error('Error in View Coin:', error);
        throw error;
    }
};




// Top Three Coins
// http://localhost:5000/user/top-three-coins/ethereum
export const topThreeCoins = async () => {
    try {
        const response = await apiInstance.get(`/user/top-three-coins/${checkBlockChain}`);
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


// http://localhost:5000/admin/admin-addresses/ethereum
export const adminTokenAddress = async () => {
    try {
        const response = await apiInstance.get(`/admin/admin-addresses/${checkBlockChain}`);

        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


// http://localhost:5000/user/view-profile
export const viewUserprofile = async () => {
    try {
        const response = await apiInstance.get(`/user/view-profile`);

        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


export const CheckFollow = async (id) => {
    try {
        const response = await apiInstance.post('user/check-follow', {
            user_id: id
        });

        return response.data;
    } catch (error) {

    }
};



export const toggleFollow = async (id) => {
    try {
        const response = await apiInstance.post('user/toggle-follow', {
            user_id: id
        });

        return response.data;
    } catch (error) {

    }
};


export const toggleLike = async (thread_id) => {
    try {
        const response = await apiInstance.post('thread/toggle-like', {
            thread_id: thread_id,
        });

        return response.data;
    } catch (error) {

    }
};

export const checkLikeStatus = async (thread_id) => {
    try {
        const response = await apiInstance.post('thread/check-like-status', {
            thread_id: thread_id,
        });

        return response.data;
    } catch (error) {

    }
};


export const getNotifications = async () => {
    try {
        const response = await apiInstance.get(`/user/notifications`);
        return response.data;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
};


export const resetNotificationsCount = async () => {
    try {
        const response = await apiInstance.get(`/user/reset-notification-count`);
        return response.data;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
};


// http://localhost:5000/trade/lastest-data
// trade/lastest-data
export const getLatestNotifications = async () => {
    try {
        const response = await apiInstance.get(`/trade/lastest-data/${checkBlockChain}`);
        return response.data;
    } catch (error) {
        console.error('Error getting latest notifications:', error);
        throw error;
    }
};


export const TradeGraphData = async (coinId) => {
    try {
        const response = await apiInstance.get(`/trade/graph-data?type=${checkBlockChain}&token_id=${coinId}&time=1day&bucketSize=2&bucketUnit=minute`)
        // console.log("response of the graph",response)
        //  const response = await apiInstance.get(`/trade/graph-random-data`)
        return response.data;
    } catch (error) {

        throw error;
    }
}

