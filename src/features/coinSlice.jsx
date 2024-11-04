import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { viewCoins } from '../utils/api';

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async () => {
    const response = await viewCoins();
    return response.data;
});

const coinSlice = createSlice({
    name: 'coins',
    initialState: {
        coins: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoins.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched coins to the array
                state.coins = action.payload;
            })
            .addCase(fetchCoins.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectCoinById = (state, id) =>
    state.coins.coins.find((coin) => coin.coin?._id === id);


export default coinSlice.reducer;
