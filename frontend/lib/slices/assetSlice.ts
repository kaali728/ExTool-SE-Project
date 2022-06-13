import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';



export const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    asset: null,
    assets: []
  },
  reducers: {
    getAllAssets: (state, action) => {
        state.assets = action.payload
    }
  },
});

export const { getAllAssets } = assetSlice.actions;

// selectors
export const selectAssets = (state:any) => state.assets;

export default assetSlice.reducer;