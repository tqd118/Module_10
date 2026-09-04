import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/social";
import { gql } from "@/api/graphql";

interface AuthState {
    user: User | null;
    userId: number | null;
    ready: boolean;
}

const initialState: AuthState = {
    user: null,
    userId: null,
    ready: false,
};

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
    errors: string[];
}

function saveToken(token: string) {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; SameSite=Lax`;
}

function clearToken() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
}

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }: { email: string; password: string }): Promise<User> => {
        try {
            const { login } = await gql<{ login: AuthResponse }>(
                `mutation Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        token
                        user { ${USER_FIELDS} }
                    }
                }`,
                { email, password },
            );
            saveToken(login.token);
            return login.user;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to login");
        }
    },
);

export const register = createAsyncThunk(
    "auth/register",
    async ({ email, password }: { email: string; password: string }) => {
        const { signup } = await gql<{ signup: { message: string } }>(
            `mutation Signup($email: String!, $password: String!) {
                signup(email: $email, password: $password) { message }
            }`,
            { email, password },
        );
        return signup.message;
    },
);

export const logout = createAsyncThunk("auth/logout", async (): Promise<void> => {
    try {
        await gql(`mutation { logout { message } }`);
    } finally {
        clearToken();
    }
});

export const update = createAsyncThunk(
    "auth/update",
    async (input: Omit<Partial<User>, "id">) => {
        try {
            const { updateProfile } = await gql<{ updateProfile: User }>(
                `mutation UpdateProfile($input: UpdateProfileInput!) {
                    updateProfile(input: $input) { ${USER_FIELDS} }
                }`,
                { input },
            );
            return updateProfile;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to update profile");
        }
    },
);

export const initAuth = createAsyncThunk(
    "auth/init",
    async (): Promise<User | null> => {
        if (!localStorage.getItem("token")) return null;
        try {
            const { me } = await gql<{ me: User }>(`query { me { ${USER_FIELDS} } }`);
            return me;
        } catch {
            clearToken();
            return null;
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.userId = action.payload.id;
                state.ready = true;
            })
            .addCase(login.rejected, (state) => { state.ready = true; })
            .addCase(logout.fulfilled, (state) => { state.user = null; state.userId = null; })
            .addCase(register.fulfilled, (_, action) => { console.log(action); })
            .addCase(update.fulfilled, (state, action) => { state.user = action.payload; })
            .addCase(initAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.userId = action.payload?.id ?? null;
                state.ready = true;
            })
            .addCase(initAuth.rejected, (state) => { state.ready = true; });
    },
});

export default authSlice.reducer;