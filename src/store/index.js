import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import platformsReducer from './platformsSlice';

export const actionHistory = [];
let actionListener = null;

export const registerActionListener = (listener) => {
  actionListener = listener;
  if (listener) listener([...actionHistory]);
};

const actionLoggerMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const isThunkMeta = (/(\/pending|\/rejected|\/fulfilled)$/).test(action.type);
  const entry = {
    id: Math.random().toString(36).slice(2, 7),
    type: action.type,
    payload: action.payload,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stateSnapshot: store.getState(),
    isThunkMeta
  };
  actionHistory.push(entry);
  actionListener?.([...actionHistory]);
  return result;
};

const store = configureStore({
  reducer: { posts: postsReducer, platforms: platformsReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLoggerMiddleware)
});

export default store;
