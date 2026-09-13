import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isConnected: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isConnected: false,
  error: null
};

export const profileOrdersWsConnect = createAction<string>(
  'profileOrders/wsConnect'
);
export const profileOrdersWsDisconnect = createAction(
  'profileOrders/wsDisconnect'
);
export const profileOrdersWsOpen = createAction('profileOrders/wsOpen');
export const profileOrdersWsClose = createAction('profileOrders/wsClose');
export const profileOrdersWsError = createAction<string>(
  'profileOrders/wsError'
);
export const profileOrdersWsMessage = createAction<{
  orders: TOrder[];
}>('profileOrders/wsMessage');

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersWsOpen, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(profileOrdersWsClose, (state) => {
        state.isConnected = false;
      })
      .addCase(profileOrdersWsError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addCase(profileOrdersWsMessage, (state, action) => {
        state.orders = action.payload.orders;
      });
  }
});

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;

export const profileOrdersReducer = profileOrdersSlice.reducer;
export default profileOrdersSlice.reducer;
