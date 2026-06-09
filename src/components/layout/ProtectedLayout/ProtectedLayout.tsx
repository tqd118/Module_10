import { useUser } from "@/context/UserContext";
import { useInitAuth } from "@/hooks/useInitAuth";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedLayout() {
  const { ready } = useInitAuth();
  const { userId } = useUser();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <Navigate to="/login" replace/>;
  }

  return <Outlet />;
};