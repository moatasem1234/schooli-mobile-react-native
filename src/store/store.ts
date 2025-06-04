// src/store/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { StudentApi } from './api/studentApi';
import { ParentApi } from './api/parentApi';
import { ClassroomApi } from './api/classroomApi';
import { ChatApi } from './api/chatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [StudentApi.reducerPath]: StudentApi.reducer,
    [ParentApi.reducerPath]: ParentApi.reducer,
    [ClassroomApi.reducerPath]: ClassroomApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      StudentApi.middleware,
      ParentApi.middleware,
      ClassroomApi.middleware,
      ChatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;