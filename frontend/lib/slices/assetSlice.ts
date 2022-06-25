import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "lib/store";
import { AssetType } from "types/global";

export type AssetsState = {
  content: {
    selectedAsset: AssetType | null;
    assets: Array<AssetType>;
    assetsChanged: boolean;
    filteredAssets: Array<AssetType>;
  };
};

const initialState: AssetsState = {
  content: {
    selectedAsset: null,
    assets: [],
    assetsChanged: false,
    filteredAssets: [],
  },
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    getAllAssets: (state, action) => {
      state.content.assets = action.payload;
    },
    getAssets: (state, action) => {
      state.content.selectedAsset = action.payload;
    },
    setAssetsChanged: (state, action: PayloadAction<{ changed: boolean }>) => {
      state.content.assetsChanged = action.payload.changed;
    },
    setfilteredAssets(state, action: PayloadAction<Array<AssetType>>) {
      state.content.filteredAssets = action.payload;
    },
  },
});

export const { getAllAssets, setAssetsChanged } = assetSlice.actions;

function selectSelf(state: RootState): AssetsState {
  return state.assets;
}

// selectors
export const selectAssetsConten = createSelector(
  selectSelf,
  (state) => state.content
);
export const selectAssets = createSelector(
  selectSelf,
  (state) => state.content.assets
);
export const assetsChanged = createSelector(
  selectSelf,
  (state) => state.content.assetsChanged
);

export default assetSlice.reducer;
