import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    selectdAsset: null,
    assets: [],
    assetsChanged: false
  },
  reducers: {
    getAllAssets: (state, action) => {
        state.assets = action.payload
    },
    setAssetsChanged: (state, action:PayloadAction<{changed: boolean}>) => {
      state.assetsChanged = action.payload.changed;
    }
  },
});

export const { getAllAssets, setAssetsChanged } = assetSlice.actions;

// selectors
export const selectAssets = (state:any) => state.assets.assets;
export const assetsChanged = (state:any) => state.assets.assetsChanged;

export default assetSlice.reducer;