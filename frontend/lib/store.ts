import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import assetReducer from './slices/assetSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    assets: assetReducer
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;