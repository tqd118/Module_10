import { useState } from "react";
import s from "./Register.module.scss"
import Button from "@/components/ui/Button"
import InputField from "@/components/ui/InputField";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";
import { Link } from "react-router-dom";
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

export default function Register() {
	const { signup } = useAuth();
	const { showToast } = useToast()

	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema,
		onSubmit: async values => {
			setLoading(true);
			try {
				await signup(values.email, values.password);
				showToast("Succesfuly registered", "success");
			} catch (e) {
				formik.errors.password = e instanceof Error ? e.message : "Registration failed";
			} finally {
				setLoading(false);
			}
		}
	});

	const passwordStrength = formik.values.password.length >= 8 ? "Your password is strong" : "";

	return (
		<div className={s.page}>
			<div>
				<h2 className={s.heading}>Create an account</h2>
				<p className={s.subHeading}>
				Enter your email and password<br/>to sign up to this app
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
					success={formik.touched.password && !formik.errors.password}
					hint={passwordStrength}/>

				<Button disabled={loading} type="submit">
					Sign Up
				</Button>
			</form>

			<p className={s.policy}>By clicking continue, you agree to our <a href="#">Terms of Service</a><br/> and <a href="#">Privacy Policy</a></p>

			<span className={s.signIn}>
				Already have an account? <Link to="/login">Sign In</Link>
			</span>
		</div>
	);
}

