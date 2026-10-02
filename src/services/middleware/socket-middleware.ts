import { Middleware } from 'redux';
import { Action } from '@reduxjs/toolkit';

export type TWsActionTypes = {
  connect: string;
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

type TWsAction = Action & { payload?: unknown };

export const socketMiddleware = (wsActions: TWsActionTypes): Middleware => {
  let socket: WebSocket | null = null;

  const middleware: Middleware = (store) => (next) => (action: unknown) => {
    const { dispatch } = store;
    const { connect, disconnect, onOpen, onClose, onError, onMessage } =
      wsActions;
    const wsAction = action as TWsAction;

    if (connect === wsAction.type) {
      socket = new WebSocket(wsAction.payload as string);

      socket.onopen = () => {
        dispatch({ type: onOpen });
      };

      socket.onerror = () => {
        dispatch({ type: onError, payload: 'Ошибка соединения' });
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.success === false) {
            dispatch({
              type: onError,
              payload: data.message ?? 'Ошибка получения данных'
            });
            return;
          }
          dispatch({ type: onMessage, payload: data });
        } catch (e) {
          dispatch({ type: onError, payload: 'Не удалось разобрать ответ' });
        }
      };

      socket.onclose = () => {
        dispatch({ type: onClose });
      };
    }

    if (disconnect === wsAction.type && socket) {
      socket.close();
      socket = null;
    }

    next(action);
  };

  return middleware;
};
