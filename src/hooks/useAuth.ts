"use client";

import { useAppDispatch } from "@/store/hooks";
import { login as loginThunk, logout as logoutThunk, register as registerThunk } from "@/store/authSlice";

export function useAuth() {
    const dispatch = useAppDispatch();

    return {
        login: (email: string, password: string) =>
            dispatch(loginThunk({ email, password })).unwrap(),
        signup: (email: string, password: string) =>
            dispatch(registerThunk({ email, password })).unwrap(),
        logout: () => dispatch(logoutThunk()).unwrap(),
    };
}
