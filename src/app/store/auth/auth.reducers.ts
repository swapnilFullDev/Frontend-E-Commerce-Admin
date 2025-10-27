import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.models";
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  login,
  loginFail,
  loginSuccess,
  logout,
} from "./auth.actions";

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true })),

  on(loginSuccess, (state, { token }) => ({
    ...state,
    loading: false,
    token,
    error: null,
  })),

  on(loginFail, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(loadUser, (state) => ({ ...state, loading: true })),

  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(loadUserFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(logout, (state) => initialState)
);
