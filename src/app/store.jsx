// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/profileSlice';
import coinReducer from '../features/coinSlice';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        coins: coinReducer,
    },
});

export default store;
