import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null
};

export const feedWsConnect = createAction<string>('feed/wsConnect');
export const feedWsDisconnect = createAction('feed/wsDisconnect');
export const feedWsOpen = createAction('feed/wsOpen');
export const feedWsClose = createAction('feed/wsClose');
export const feedWsError = createAction<string>('feed/wsError');
export const feedWsMessage = createAction<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>('feed/wsMessage');

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsOpen, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(feedWsClose, (state) => {
        state.isConnected = false;
      })
      .addCase(feedWsError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addCase(feedWsMessage, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedError = (state: RootState) => state.feed.error;

export const feedReducer = feedSlice.reducer;
export default feedSlice.reducer;
