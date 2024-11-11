import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch trades data
export const fetchTrades = createAsyncThunk(
    'trades/fetchTrades',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}trade/view/${id}`);
            if (response.data.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue("Failed to fetch trades");
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch top holders data
export const fetchTopHolders = createAsyncThunk(
    'holders/fetchTopHolders',
    async (tokenAddress, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}user/top-holders`, {
                token_address: tokenAddress
            });
            if (response.data.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue("Failed to fetch top holders");
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const tradesSlice = createSlice({
    name: 'trades',
    initialState: {
        trades: [],
        loading: false,
        error: null,
        holders: [], // Added holders state
        holdersLoading: false, // Added holders loading state
        holdersError: null, // Added holders error state
    },
    reducers: {
        resetTrades: (state) => {
            state.trades = [];
            state.error = null;
            state.loading = false;
            state.holders = [];
            state.holdersError = null;
            state.holdersLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling fetchTrades async actions
            .addCase(fetchTrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrades.fulfilled, (state, action) => {
                state.loading = false;
                state.trades = action.payload;
            })
            .addCase(fetchTrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handling fetchTopHolders async actions
            .addCase(fetchTopHolders.pending, (state) => {
                state.holdersLoading = true;
                state.holdersError = null;
            })
            .addCase(fetchTopHolders.fulfilled, (state, action) => {
                state.holdersLoading = false;
                state.holders = action.payload;
            })
            .addCase(fetchTopHolders.rejected, (state, action) => {
                state.holdersLoading = false;
                state.holdersError = action.payload;
            });
    }
});

export const { resetTrades } = tradesSlice.actions;
export default tradesSlice.reducer;
