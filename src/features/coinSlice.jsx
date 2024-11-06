import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { viewCoins } from '../utils/api';

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async (sortBy) => {
    const response = await viewCoins(sortBy);
    return response.data;
});


const coinSlice = createSlice({
    name: 'coins',
    initialState: {
        coins: [],
        filteredCoins: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        searchCoins: (state, action) => {
            const query = action.payload.toLowerCase();
            state.filteredCoins = state.coins.filter(coin =>
                coin.coin?.name.toLowerCase().includes(query)
            );
        },
        // New action for sorting coins
        sortCoins: (state, action) => {
            state.status = 'loading';
            // Trigger the fetchCoins async action with the new sort parameter
            fetchCoins(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoins.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coins = action.payload;
                state.filteredCoins = action.payload; // Initialize filteredCoins with all coins
            })
            .addCase(fetchCoins.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { searchCoins, sortCoins } = coinSlice.actions;

export const selectCoinById = (state, id) =>
    state.coins.coins.find((coin) => coin.coin?._id === id);

export const selectDeployedCoins = (state) =>
    state.coins.coins.filter((coin) => coin.coin?.status === 'deployed');

export const selectCreatedCoins = (state) =>
    state.coins.coins.filter((coin) => coin.coin?.status === 'created');

export const selectFilteredCoins = (state) => state.coins.filteredCoins;

export default coinSlice.reducer;
