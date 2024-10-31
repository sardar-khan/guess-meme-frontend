// utils/api.js
import axios from "axios";
import { toast } from 'react-toastify';
import SecureLS from 'secure-ls';

// Initialize SecureLS
const ls = new SecureLS({ encodingType: 'aes' });
const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

export const handleSignUp = async (address, blockchain) => {
    try {
        const response = await axios.post(`${apiUrl}user/register`, {
            address: address,
            blockchain: blockchain
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



export const viewProfile = async () => {
    try {
        const response = await axios.get(
            `${apiUrl}user/view-profile`,
            {
                headers: {
                    'x-access-token': token,
                },
            }
        );
        console.log("viewProfile", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};


// Update the editProfile function
export const editProfile = async ({ user_name, bio, prfoile_photo }) => {
    try {
        const response = await axios.post(
            `${apiUrl}user/edit-profile`,
            {
                user_name,
                bio,
                prfoile_photo
            },
            {
                headers: {
                    'x-access-token': token,
                },
            }
        );
        console.log("editProfile", response.data);
        return response.data;
    } catch (error) {
        console.error('Error during edit Profile:', error);
        throw error;
    }
};

