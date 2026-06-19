import s from "./Profile.module.scss";
import Button from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastsContext";
import { getAssetUrl } from '@/utils/getAssetUrl';
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useFormik } from "formik";
import { object, string }from 'yup';
import { useState } from "react";

const validationSchema = object().shape({
  firstName: string().required("First name is required"),
  secondName: string().required("Second name is required"),
  
  username:
    string()
        .required("Username is required")
        .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username must contain only letters, numbers and _"
        ),

  email:
    string()
        .required("Email is required")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),

  description:
    string()
        .max(200),
});

export default function ProfileInfo() {
    const { updateProfile } = useProfile();
    const { theme, toggle } = useTheme();
    const { user } = useUser();
    const { showToast } = useToast();
    const { logout } = useAuth();

    const formik = useFormik({
        initialValues: {
            profileImage: user?.profileImage,
            firstName: user?.firstName,
            secondName: user?.secondName,
            username: user?.username,
            email: user?.email,
            description: user?.description
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: values => {
            if (!user) {
                return;
            }

            const initial = formik.initialValues;
            if ((Object.keys(initial) as Array<keyof typeof initial>)
                .every(key => initial[key] === values[key])) return;

            updateProfile(values);
            showToast("Profile info has been updated successfully", "success");
        }
    })

    const handleIconSelect = (file?: File) => {
        if (!file) return;
        formik.setFieldValue("profileImage", (URL.createObjectURL(file)));
    }

    const handleLogout = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        logout();
    }

    const { 
        profileImage,
        firstName,
        secondName,
        description,
        email,
        username
    } = formik.values;

    const { handleChange, errors } = formik;
    const [fullNameInput, setFullNameInput] = useState(`${firstName} ${secondName}`.trim());


    return (
        <div className={s.info}>
            <form 
                className={s.profile}
                id="changeProfile"
                onSubmit={formik.handleSubmit}>

                <h2 className={s.title}>Edit profile</h2>

                <div className={s.user}>
                    <img src={ getAssetUrl(profileImage) || "/Module_10/assets/blank-user.png" } alt="avatar" />

                    <div>
                        <span>
                            {firstName + " " + secondName}
                        </span>

                        <label
                            className={s.changePhoto}
                            htmlFor="profileImage"
                        >
                            Change profile photo
                        </label>

                        <input
                            hidden
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={e =>
                                handleIconSelect(e.target.files?.[0])
                            }
                        />
                    </div>
                </div>

                <label className={s.inputLabel}>
                    <span className="icon-user">Username</span>

                    <input
                        id="username"
                        name="username"
                        
                        className={s.profileInput}
                        placeholder="@username123"
                        form="changeProfile"
                        
                        value={username}
                        onChange={handleChange}
                    />

                    {errors.username && (
                        <span className={s.error}>
                            {errors.username}
                        </span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-user">Full name</span>
                    <input
                        id="fullName"
                        name="fullName"
                        className={s.profileInput}
                        placeholder="John Doe"
                        form="changeProfile"
                        value={fullNameInput}
                        onChange={e => {
                            const raw = e.target.value;
                            setFullNameInput(raw);

                            const [first = "", ...rest] = raw.split(" ");
                            formik.setFieldValue("firstName", first.trim());
                            formik.setFieldValue("secondName", rest.join(" ").trim());
                        }}
                        onBlur={() => {
                            setFullNameInput(`${firstName} ${secondName}`.trim());
                            formik.setFieldTouched("firstName", true);
                            formik.setFieldTouched("secondName", true);
                        }}/>
                    {(formik.touched.firstName || formik.touched.secondName) &&
                        (errors.firstName || errors.secondName) && (
                        <span className={s.error}>
                            {errors.firstName || errors.secondName}
                        </span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-mail">Email</span>

                    <input
                        id="email"
                        name="email"

                        type="email"
                        className={s.profileInput}
                        placeholder="email@domain.com"
                        form="changeProfile"

                        value={email}
                        onChange={handleChange}
                    />

                    {errors.email && (
                        <span className={s.error}>
                            {errors.email}
                        </span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-pen">Description</span>

                    <textarea
                        id="description"
                        name="description"

                        className={s.profileInput}
                        placeholder="Write description here..."
                        form="changeProfile"

                        value={description}
                        onChange={handleChange}
                    />

                    <span className={s.descriptionWarn}>
                        {errors.description ? (
							<span className={`icon-info ${s.error}`}>Reached the 200 chars limit</span>
						) : (
							<span className="icon-info">Max 200 chars</span>
						)}
                    </span>
                </label>

                <Button 
                    className={s.saveInfoButton} 
                    type="submit"
                    form="changeProfile"
                >
                    Save Profile Changes
                </Button>
            </form>

            <form className={s.preferences} onSubmit={e => handleLogout(e)}>
                <h2 className={s.title}>Preferences</h2>

                <label className={s.themeSwitch}>
                    <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={toggle}
                        hidden
                    />

                    <span className={s.slider} />
                    <span className={s.switchTitle}>Dark theme</span>
                </label>

                <h2 className={s.title}>Actions</h2>

                <Button className={s.logoutButton}>
                    Logout
                </Button>
            </form>
        </div>
    );
}