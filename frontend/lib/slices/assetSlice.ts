import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import { RootState } from "lib/store";
import {
  AssetPictureDownloadUrl,
  AssetTableObject,
  AssetType,
  OfficeNote,
} from "types/global";

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
          status: ASSET_PICK_DROP;
          destination: string;
          images: AssetPictureDownloadUrl;
          additionalImages: string[];
          diesel: number;
          hours: number;
          officeNotes: OfficeNote[];
          report: string;
          confirmed: boolean;
          confirmedDate: string;
        };
      }>
    ) {
      if (
        state.content.selectedAsset === null ||
        state.content.selectedAsset === undefined
      )
        return;
      const index = state.content.selectedAsset.table.findIndex(
        (element: AssetTableObject, index: number) =>
          element.destination === action.payload.tableContent.destination &&
          element.date === action.payload.tableContent.date
      );
      
      state.content.selectedAsset.table[index].status =
        action.payload.tableContent.status;
      state.content.selectedAsset.table[index].images =
        action.payload.tableContent.images;
      state.content.selectedAsset.table[index].additionalImages =
        action.payload.tableContent.additionalImages;
      state.content.selectedAsset.table[index].diesel =
        action.payload.tableContent.diesel;
      state.content.selectedAsset.table[index].hours =
        action.payload.tableContent.hours;
      state.content.selectedAsset.table[index].officeNotes =
        action.payload.tableContent.officeNotes;
      state.content.selectedAsset.table[index].report =
        action.payload.tableContent.report;
      state.content.selectedAsset.table[index].confirmed =
        action.payload.tableContent.confirmed;
      state.content.selectedAsset.table[index].confirmedDate =
        action.payload.tableContent.confirmedDate;
    },
    replaceSelectedAssetTable(
      state,
      action: PayloadAction<{
        table: AssetTableObject[];
      }>
    ) {
      if (
        state.content.selectedAsset === null ||
        state.content.selectedAsset === undefined
      )
        return;
      state.content.selectedAsset.table = action.payload.table;
    },
  },
});

export const {
  getAllAssets,
  setAssetsChanged,
  setSelectedAsset,
  setfilteredAssets,
  updateSelectedAssetTable,
  replaceSelectedAssetTable,
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
export const selectAssetFilter = createSelector(
  selectSelf,
  (state) => state.content.filteredAssets
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
