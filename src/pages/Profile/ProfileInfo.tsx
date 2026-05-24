import s from "./Profile.module.scss";
import Button from "@/components/ui/Button";
import { useSocial } from "@/context/SocialContext";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastsContext";
import { getAssetUrl } from '@/utils/getAssetUrl';

interface Errors {
    userFullName?: string;
    username?: string;
    userMail?: string;
    userDescription?: string;
}

export default function ProfileInfo() {
    const navigate = useNavigate();

    const { state, dispatch } = useSocial();
    const { theme, toggle } = useTheme();
    const { userId, setUserId } = useUser();
    const { showToast } = useToast();

    const user = state.users.find(u => u.id === userId);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    const [userIcon, setUserIcon] = useState("");
    const [userFullName, setUserFullName] = useState(user?.userFullName ?? "");
    const [username, setUsername] = useState(user?.username ?? "");
    const [userMail, setUserMail] = useState(user?.userMail ?? "");
    const [userDescription, setUserDescription] = useState(user?.userDescription ?? "");

    const [errors, setErrors] = useState<Errors>({});

    const handleIconSelect = (file?: File) => {
        if (!file) return;

        setUserIcon(URL.createObjectURL(file));
    };

    const validate = () => {
        const newErrors: Errors = {};

        if (!userFullName.trim()) {
            newErrors.userFullName = "Full name is required";
        }

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^@[a-zA-Z0-9_]+$/.test(username)) {
            newErrors.username =
                "Username must start with @ and contain only letters, numbers and _";
        }

        if (!userMail.trim()) {
            newErrors.userMail = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(userMail)) {
            newErrors.userMail = "Invalid email";
        }

        if (userDescription.length > 200) {
            newErrors.userDescription =
                "Description must be less than 200 chars";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate() || !user) {
            return;
        }

        const updatedData = {
            userFullName,
            userIcon: userIcon || user.userIcon,
            username,
            userMail,
            userDescription
        };

        const hasChanges = updatedData.userFullName !== user.userFullName ||
                           updatedData.userIcon !== user.userIcon ||
                           updatedData.username !== user.username ||
                           updatedData.userMail !== user.userMail ||
                           updatedData.userDescription !== user.userDescription;

        if (!hasChanges) {
            return;
        }

        dispatch({
            type: "UPDATE_USER",
            payload: {
                id: user.id,
                data: updatedData
            }
        });

        showToast("Profile info has been updated successfully", "success");
    };

    return (
        <div className={s.info}>
            <form className={s.profile}>
                <h2 className={s.title}>Edit profile</h2>

                <div className={s.user}>
                    <img src={getAssetUrl(userIcon || user?.userIcon)} alt="avatar" />

                    <div>
                        <label className={s.userNameChange}>
                            <input
                                type="text"
                                id="userNameInput"
                                value={userFullName}
                                onChange={e =>
                                    setUserFullName(e.currentTarget.value)
                                }
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
                        value={userMail}
                        onChange={e => setUserMail(e.currentTarget.value)}
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
                        value={userDescription}
                        onChange={e =>
                            setUserDescription(e.currentTarget.value)
                        }
                    />

                    <span className={s.descriptionWarn}>
                        {userDescription.length >= 200 ? (
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

                <Button
                    text="Save Profile Changes"
                    handler={handleSubmit}
                    className={s.saveInfoButton}
                />
            </form>

            <div className={s.preferences}>
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

                <Button
                    text="Logout"
                    handler={() => setUserId(null)}
                    className={s.logoutButton}
                />
            </div>
        </div>
    );
}