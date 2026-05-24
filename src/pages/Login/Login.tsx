import { useState } from "react";
import s from "./Login.module.scss";
import Button from "@/components/ui/Button";
import { useSocial } from "@/context/SocialContext";
import { useUser } from "@/context/UserContext";
import InputField from "@/components/ui/InputField";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
	const { state } = useSocial();
	const { setUserId } = useUser();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const navigate = useNavigate();

	const validateEmail = (value: string) => {
		if (!value) return "Email is required";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return "Email is not valid";
		}
		return "";
	};

	const validatePassword = (value: string) => {
		if (!value) {
			return "Password is required";
		}
		if (value.length < 6) {
			return "Password too short";
		}
		return "";
	};

	const handleSubmit = () => {
		const emailErr = validateEmail(email);
		const passErr = validatePassword(password);

		setEmailError(emailErr);
		setPasswordError(passErr);

		if (emailErr || passErr) return;

		const foundUser = state.users.find(u => u.userMail === email && u.userPassword === password);

		if (!foundUser) {
			setPasswordError("Incorrect password");
			return;
		}

		setUserId(foundUser.id);
		navigate("/");
	};

	return (
		<div className={s.page}>
			<div>
				<h2 className={s.heading}>Sign in into an account</h2>
				<p className={s.subHeading}>
				Enter your email and password<br/>to sign in into this app
				</p>
			</div>

			<form className={s.form} onSubmit={e => e.preventDefault()}>
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

				<Button text="Sign In" handler={handleSubmit}/>
			</form>

			<span className={s.signUp}>
				Forgot to create an account? <Link to="/register">Sign up</Link>
			</span>
		</div>
	);
}
