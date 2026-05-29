export const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Email is not valid";
    }
    return "";
};

export const validatePassword = (value: string) => {
    if (!value) {
        return "Password is required";
    }
    if (value.length < 6) {
        return "Password too short";
    }
    return "";
};