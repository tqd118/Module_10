
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { initAuth } from "@/store/authSlice";

export default function ProtectedLayout() {
    const dispatch = useAppDispatch();
    const ready = useAppSelector(state => state.auth.ready);
    const userId = useAppSelector(state => state.auth.userId);
    
    useEffect(() => {
        dispatch(initAuth());
    });

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
