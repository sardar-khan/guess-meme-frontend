import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { viewCoins } from '../utils/api';


export const fetchCoins = createAsyncThunk('coins/fetchCoins', async ({sortBy,coinSorting}) => {
   //  
    const response = await viewCoins({sortBy,coinSorting});
    return response; 
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
        sortCoins: (state, action) => {
            state.status = 'loading';
            fetchCoins(action.payload); // This will be called directly, but the response handling will be in extraReducers
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoins.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coins = action.payload.data; // Access the data from the response
                state.filteredCoins = action.payload.data; // Update filteredCoins
            })
            .addCase(fetchCoins.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message;
            });
    },
});

export const { searchCoins, sortCoins } = coinSlice.actions;


export const selectCoinById = (state, id) =>
    state.coins.coins.find((coin) => coin.coin?._id === id);

// export const selectDeployedCoins = (state) =>
//     state.coins.coins.filter((coin) => coin?.status === 'deployed');
export const selectDeployedCoins = createSelector(
    (state) => state.coins.coins, // Input selector
    (coins) => coins.filter((coin) => coin?.status === 'deployed') // Memoized output
  );


// export const selectCreatedCoins = (state) =>
//     state.coins.coins.filter((coin) => coin?.status === 'created');
export const selectCreatedCoins = createSelector(
    (state) => state.coins.coins, // Input selector
    (coins) => coins.filter((coin) => coin?.status === 'created') // Memoized output
  );

export const selectFilteredCoins = (state) => state.coins.filteredCoins;

export default coinSlice.reducer;