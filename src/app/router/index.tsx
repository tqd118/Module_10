import { createHashRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ProfilePage from "@/pages/Profile";
import Error404 from "@/pages/Error404";
import Error from "@/pages/Error";

export const router = createHashRouter([
    {
		path: "/",
		element: <MainLayout />,
		errorElement: <Error />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
			{ path: "profile/:page/:userId", element: <ProfilePage /> },
			{ path: "*", element: <Error404 /> },
		],
    },
]);
