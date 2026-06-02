import { useState } from "react";
import s from "./Register.module.scss"
import Button from "@/components/ui/Button"
import InputField from "@/components/ui/InputField";
import { validateEmail, validatePassword } from "@/utils/validation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";
import { Link } from "react-router-dom";


export default function Register() {
	const { signup } = useAuth();
	const { showToast } = useToast()

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		const emailErr = validateEmail(email);
		const passErr = validatePassword(password);

		setEmailError(emailErr);
		setPasswordError(passErr);

		if (emailErr || passErr) return;

        try {
			await signup(email, password);
			//await login(email, password);
			//navigate("/");
			showToast("Succesfuly registered", "success");
		} catch (e) {
			setPasswordError(e instanceof Error ? e.message : "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	const passwordStrength = password.length >= 8 ? "Your password is strong" : "";

	return (
		<div className={s.page}>
			<div>
				<h2 className={s.heading}>Create an account</h2>
				<p className={s.subHeading}>
				Enter your email and password<br/>to sign up to this app
				</p>
			</div>

			<form className={s.form} onSubmit={e => handleSubmit(e)}>
				<InputField
					type="email"
					label="Email"
					placeholder="Enter email"
					value={email}
					onChange={setEmail}
					error={emailError}
					success={!emailError && email.length > 0}/>

				<InputField
					type="password"
					label="Password"
					placeholder="Enter password..."
					value={password}
					onChange={setPassword}
					error={passwordError}
					success={!passwordError && password.length > 0}
					hint={passwordStrength}/>

				<Button text="Sign Up"/>
			</form>

			<p className={s.policy}>By clicking continue, you agree to our <a href="#">Terms of Service</a><br/> and <a href="#">Privacy Policy</a></p>

			<span className={s.signIn}>
				Already have an account? <Link to="/login">Sign In</Link>
			</span>
		</div>
	);
}

