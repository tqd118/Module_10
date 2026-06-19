import { gql } from "@/api/graphql";
import type { User } from "@/types/social";
import { useUser } from "@/context/UserContext";

const USER_FIELDS = `
    id
    username
    email
    firstName
    secondName
    profileImage
    description
    bio
`;

interface AuthResponse {
    token: string;
    user: User;
}

export function useAuth() {
    const { setUserId, setUser } = useUser();

    const login = async (email: string, password: string): Promise<User> => {
        const { login } = await gql<{ login: AuthResponse }>(
            `mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                    user {
                        ${USER_FIELDS}
                    }
                }
            }`,
            { email, password }
        );

        localStorage.setItem("token", login.token);
        setUserId(login.user.id);
        setUser(login.user);

        return login.user;
    }

    const signup = async (email: string, password: string): Promise<string> => {
        const { signup } = await gql<{ signup: { message: string } }>(
            `mutation Signup($email: String!, $password: String!) {
                signup(email: $email, password: $password) {
                    message
                }
            }`,
            { email, password }
        );

        return signup.message;
    }

    const logout = async (): Promise<void> => {
        try {
            await gql(`mutation { logout { message } }`);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            setUserId(null);
            setUser(null);
        }
    }

    return { login, signup, logout }
}
