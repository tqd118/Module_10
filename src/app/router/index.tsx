import { Suspense, lazy } from "react";
import { createHashRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home";
import Error404 from "@/pages/Error404";
import Error from "@/pages/Error";

const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const ProfilePage = lazy(() => import("@/pages/Profile"));

export const router = createHashRouter([
    {
		path: "/",
		element: <MainLayout />,
		errorElement: <Error />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: "login", 
				element: (
					<Suspense fallback={<div>Loading</div>}>
						<LoginPage />
					</Suspense>
				) 
			},
			{ 
				path: "register", 
				element: (
					<Suspense fallback={<div>Loading</div>}>
						<RegisterPage /> 
					</Suspense>
				)
			},
			{ 
				path: "profile/:page/:userId", 
				element: (
					<Suspense fallback={<div>Loading</div>}>
						<ProfilePage />
					</Suspense>
				)
			},
			{ path: "*", element: <Error404 /> },
		],
    },
]);
