"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { initAuth } from "@/store/authSlice";

export function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, []);

    return null;
}