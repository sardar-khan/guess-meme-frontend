// src/store/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { viewProfile, editProfile, updateProfileSettings } from '../utils/api';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    const response = await viewProfile();

    return response.data;
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (profile) => {

    const response = await editProfile(profile);

    return response;


});





const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        username: '',
        profilePhoto: '',
        bio: '',
        trustScore: '',
        x_link:'',
        createdAt: '',
        hide_followers: false,
        hide_following: false,
        hide_notification: false,
        hide_purchase: false,
        loading: false,
        error: null,
    },
    reducers: {
        setProfile: (state, action) => {
            console.log("heros",action.payload)
            const { username, bio, profilePhoto, trustScore,x_link, createdAt, hide_followers, hide_following, hide_notification, hide_purchase } = action.payload;
            state.username = username;
            state.bio = bio;
            state.profilePhoto = profilePhoto;
            state.trustScore = trustScore;
            state.x_link = x_link;
            state.createdAt = createdAt;
            state.hide_purchase = hide_purchase;
            state.hide_followers = hide_followers;
            state.hide_following = hide_following;
            state.hide_notification = hide_notification;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.user_name;
                state.bio = action.payload.bio;
                state.profilePhoto = action.payload.profile_photo;
                state.trustScore = action.payload.trust_score;
                state.x_link = action.payload.x_link;
                state.createdAt = action.payload.createdAt;
                state.hide_followers = action.payload.hide_followers;
                state.hide_purchase = action.payload.hide_purchase;
                state.hide_following = action.payload.hide_following;
                state.hide_notification = action.payload.hide_notification;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.username = action.payload.user_name;
                state.bio = action.payload.bio;
                state.profilePhoto = action.payload.profile_photo;
                state.trustScore = action.payload.trust_score;
                state.x_link = action.payload.x_link;
                state.createdAt = action.payload.createdAt;
                state.hide_followers = action.payload.hide_followers;
                state.hide_purchase = action.payload.hide_purchase;
                state.hide_following = action.payload.hide_following;
                state.hide_notification = action.payload.hide_notification;
            })
    },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
