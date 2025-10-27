import { createAction, props } from "@ngrx/store";
import { User } from "./auth.models";

// Login
export const login = createAction(`[Auth] Login`,props<{email: string; password: string}>());
export const loginSuccess = createAction(`[Auth] Login Success`,props<{ token: string }>());
export const loginFail = createAction(`[Auth] Login Failure`,props<{error: string}>());

// Load User
export const loadUser = createAction(`[Auth] Load User`);
export const loadUserSuccess = createAction(`[Auth] Load User Success`,props<{user: User}>());
export const loadUserFailure = createAction(`[Auth] Load User Failure`,props<{error: string}>());

export const logout = createAction(`[Auth] Logout`);

// export const loadAuthFromStorage = createAction(`[Auth] Load from Storage`);