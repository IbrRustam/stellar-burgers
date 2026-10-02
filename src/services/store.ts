import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsReducer } from './slices/ingredients-slice';
import { burgerConstructorReducer } from './slices/burger-constructor-slice';
import { orderReducer } from './slices/order-slice';
import { userReducer } from './slices/user-slice';
import {
  feedReducer,
  feedWsConnect,
  feedWsDisconnect,
  feedWsOpen,
  feedWsClose,
  feedWsError,
  feedWsMessage
} from './slices/feed-slice';
import {
  profileOrdersReducer,
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
  profileOrdersWsOpen,
  profileOrdersWsClose,
  profileOrdersWsError,
  profileOrdersWsMessage
} from './slices/profile-orders-slice';
import { socketMiddleware } from './middleware/socket-middleware';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});

const feedSocketMiddleware = socketMiddleware({
  connect: feedWsConnect.type,
  disconnect: feedWsDisconnect.type,
  onOpen: feedWsOpen.type,
  onClose: feedWsClose.type,
  onError: feedWsError.type,
  onMessage: feedWsMessage.type
});

const profileOrdersSocketMiddleware = socketMiddleware({
  connect: profileOrdersWsConnect.type,
  disconnect: profileOrdersWsDisconnect.type,
  onOpen: profileOrdersWsOpen.type,
  onClose: profileOrdersWsClose.type,
  onError: profileOrdersWsError.type,
  onMessage: profileOrdersWsMessage.type
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      feedSocketMiddleware,
      profileOrdersSocketMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
