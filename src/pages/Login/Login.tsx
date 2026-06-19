import { useState } from "react";
import s from "./Login.module.scss";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "@/utils/validation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";

export default function Login() {
	const { login } = useAuth()
	const { showToast } = useToast()

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [loading, setLoading] = useState(false)

	const navigate = useNavigate();

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const emailErr = validateEmail(email);
		const passErr = validatePassword(password);

		setEmailError(emailErr);
		setPasswordError(passErr);

		if (emailErr || passErr) return;

		setLoading(true);

		try {
			await login(email, password);
			navigate("/");
			showToast("Succesfuly sign in", "success");
		} catch(e) {
			setPasswordError(e instanceof Error ? e.message : "Incorrect email or password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={s.page}>
			<div>
				<h2 className={s.heading}>Sign in into an account</h2>
				<p className={s.subHeading}>
				Enter your email and password<br/>to sign in into this app
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
					success={!passwordError && password.length > 0}/>

				<Button disabled={loading}>
					Sign In
				</Button>
			</form>

			<span className={s.signUp}>
				Forgot to create an account? <Link to="/register">Sign up</Link>
			</span>
		</div>
	);
}
