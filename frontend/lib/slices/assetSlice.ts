import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
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

export type AssetTableObject = {
  date: string;
  destination: string;
  status: ASSET_PICK_DROP.ASSET_CREATED |ASSET_PICK_DROP.DROPEDOFF | ASSET_PICK_DROP.DROP_OFF | ASSET_PICK_DROP.PICKEDUP | ASSET_PICK_DROP.PICKUP;
  confirmed: boolean;
}

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
    setSelectedAsset(
      state,
      action: PayloadAction<{ asset: AssetType | null }>
    ) {
      state.content.selectedAsset = action.payload.asset;
    },
    updateSelectedAssetTable(
      state,
      action: PayloadAction<{
        tableContent: {
          date: string;
          status: string;
          destination: string;
          images: string[];
        };
      }>
    ) {
      state.content.selectedAsset?.table.unshift(action.payload.tableContent);
    },
  },
});

export const {
  getAllAssets,
  setAssetsChanged,
  setSelectedAsset,
  updateSelectedAssetTable,
} = assetSlice.actions;

function selectSelf(state: RootState): AssetsState {
  return state.assets;
}

// selectors
export const selectAssetsContent = createSelector(
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
export const selectedAssetSelector = createSelector(
  selectSelf,
  (state) => state.content.selectedAsset
);

export default assetSlice.reducer;
