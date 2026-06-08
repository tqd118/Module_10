import s from "./Profile.module.scss";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastsContext";
import { getAssetUrl } from '@/utils/getAssetUrl';
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

interface Errors {
    userFullName?: string;
    username?: string;
    userMail?: string;
    userDescription?: string;
}

export default function ProfileInfo() {
    const { updateProfile } = useProfile();
    const { theme, toggle } = useTheme();
    const { user } = useUser();
    const { showToast } = useToast();
    const { logout } = useAuth();

    const [profileImage, setProfileImage] = useState("");
    const [firstName, setFirstName] = useState(user?.firstName ?? "");
    const [secondName, setSecondName] = useState(user?.secondName ?? "");
    const [username, setUsername] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [description, setDescription] = useState(user?.description ?? "");

    const [errors, setErrors] = useState<Errors>({});

    const handleIconSelect = (file?: File) => {
        if (!file) return;

        setProfileImage(URL.createObjectURL(file));
    };

    const handleNameInput = (value: string) => {
        const [firstName, secondName] = value.split(" ");
        setFirstName(firstName);
        setSecondName(secondName);
    } 

    const validate = () => {
        const newErrors: Errors = {};

        if (!firstName.trim() || !secondName.trim()) {
            newErrors.userFullName = "Full name is required";
            showToast(newErrors.userFullName, "error");
        }

        if (!username.trim()) {
            newErrors.username = "Username is required";
            showToast(newErrors.username, "error");
        } else if (!/[a-zA-Z0-9_]+$/.test(username)) {
            newErrors.username = "Username must start with @ and contain only letters, numbers and _";
            showToast(newErrors.username, "error");
        }

        if (!email.trim()) {
            newErrors.userMail = "Email is required";
            showToast(newErrors.userMail, "error");
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.userMail = "Invalid email";
            showToast(newErrors.userMail, "error");
        }

        if (description.length > 200) {
            newErrors.userDescription = "Description must be less than 200 chars";
            showToast(newErrors.userDescription, "error");

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate() || !user) {
            return;
        }

        const updatedData = {
            firstName,
            secondName,
            profileImage: profileImage || user.profileImage,
            username,
            email,
            description
        };

        const hasChanges = updatedData.firstName !== user.firstName ||
                           updatedData.secondName !== user.secondName ||
                           updatedData.profileImage !== user.profileImage ||
                           updatedData.username !== user.username ||
                           updatedData.email !== user.email ||
                           updatedData.description !== user.description;

        if (!hasChanges) {
            return;
        }

        // dispatch({
        //     type: "UPDATE_USER",
        //     payload: {
        //         id: user.id,
        //         data: updatedData
        //     }
        // });

        updateProfile(updatedData)

        showToast("Profile info has been updated successfully", "success");

    };

    const handleLogout = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        logout();
    }

    return (
        <div className={s.info}>
            <form className={s.profile} onSubmit={e => handleSubmit(e)}>
                <h2 className={s.title}>Edit profile</h2>

                <div className={s.user}>
                    <img src={ profileImage || getAssetUrl(user?.profileImage) || "/Module_10/assets/blank-user.png" } alt="avatar" />

                    <div>
                        <label className={s.userNameChange}>
                            <input
                                type="text"
                                id="userNameInput"
                                value={firstName + " " + secondName}
                                onChange={e => handleNameInput(e.currentTarget.value)}
                            />
                        </label>

                        {errors.userFullName && (
                            <span className={s.error}>
                                {errors.userFullName}
                            </span>
                        )}

                        <label
                            className={s.changePhoto}
                            htmlFor="userIconChange"
                        >
                            Change profile photo
                        </label>

                        <input
                            hidden
                            type="file"
                            id="userIconChange"
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
                        type="text"
                        className={s.profileInput}
                        placeholder="@username123"
                        value={username}
                        onChange={e => setUsername(e.currentTarget.value)}
                    />

                    {errors.username && (
                        <span className={s.error}>
                            {errors.username}
                        </span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-mail">Email</span>

                    <input
                        type="email"
                        className={s.profileInput}
                        placeholder="email@domain.com"
                        value={email}
                        onChange={e => setEmail(e.currentTarget.value)}
                    />

                    {errors.userMail && (
                        <span className={s.error}>
                            {errors.userMail}
                        </span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-pen">Description</span>

                    <textarea
                        className={s.profileInput}
                        placeholder="Write description here..."
                        value={description}
                        onChange={e =>
                            setDescription(e.currentTarget.value)
                        }
                    />

                    <span className={s.descriptionWarn}>
                        {description.length >= 200 ? (
							<span className={`icon-info ${s.error}`}>Reached the 200 chars limit</span>
						) : (
							<span className="icon-info">Max 200 chars</span>
						)}
                    </span>

                    {errors.userDescription && (
                        <span className={s.error}>
                            {errors.userDescription}
                        </span>
                    )}
                </label>

                <Button className={s.saveInfoButton}>
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