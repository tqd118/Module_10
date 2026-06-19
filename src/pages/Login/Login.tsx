import { useState } from "react";
import s from "./Login.module.scss";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";
import { useFormik } from 'formik';
import { object, string }from 'yup';

const validationSchema = object().shape({
	email: string()
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Email is not valid")
		.required("Email is required"),
	password: string()
		.min(6, "Password too short")
		.required("Password is required")
});

export default function Login() {
	const { login } = useAuth()
	const { showToast } = useToast()
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema,
		onSubmit: async values => {
			setLoading(true);
			try {
				await login(values.email, values.password);
				navigate("/");
				showToast("Succesfuly sign in", "success");
			} catch(e) {
				formik.errors.password = e instanceof Error ? e.message : "Incorrect email or password"
			} finally {
				setLoading(false);
			}
		}
	});

	return (
		<div className={s.page}>
			<div>
				<h2 className={s.heading}>Sign in into an account</h2>
				<p className={s.subHeading}>
				Enter your email and password<br/>to sign in into this app
				</p>
			</div>

			<form className={s.form} onSubmit={formik.handleSubmit}>
				<InputField
					type="email"
					name="email"
					label="Email"

					placeholder="Enter email"

					value={formik.values.email}
					onChange={formik.handleChange}

					error={formik.touched.email ? formik.errors.email : ""}
					success={formik.touched.email && !formik.errors.email}/>

				<InputField
					type="password"
					name="password"
					label="Password"

					placeholder="Enter password..."

					value={formik.values.password}
					onChange={formik.handleChange}

					error={formik.touched.password ? formik.errors.password : ""}
					success={formik.touched.password && !formik.errors.password}/>

				<Button disabled={loading} type="submit">
					Sign In
				</Button>
			</form>

			<span className={s.signUp}>
				Forgot to create an account? <Link to="/register">Sign up</Link>
			</span>
		</div>
	);
}
