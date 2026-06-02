import { gql } from "@/api/graphql";
import { useUser } from "@/context/UserContext";
import type { User } from "@/types/social";
import { useState } from "react";

type UpdateProfileInput = Omit<Partial<User>, "id">; 

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

export function useProfile() {
    const { setUser } = useUser();
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const updateProfile = async (input: UpdateProfileInput) => {
        try {
            const { updateProfile } = await gql<{updateProfile: User}>(
                `mutation UpdateProfile($input: UpdateProfileInput!) {
                    updateProfile(input: $input) {
                        ${USER_FIELDS}
                    }
                }`,
                { input }
            )

            setUser(updateProfile);
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to update profile");
        }
    }

    const fetchSuggestedUsers = async () => {
        setLoading(true);
        try {
            const { suggestedUsers } = await gql<{suggestedUsers: User[]}>(
                `query {
                    suggestedUsers {
                        ${USER_FIELDS}
                        photo
                    }
                }`
            )

            setSuggestedUsers(suggestedUsers);
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to load suggested users");
        } finally {
            setLoading(false);
        }
    }

    const fetchMe = async (): Promise<User> => {
        const { me } = await gql<{ me: User }>(
            `query { 
                me { 
                    ${USER_FIELDS} 
                } 
            }`);
        return me;
    }

    return { suggestedUsers, loading, updateProfile, fetchSuggestedUsers, fetchMe }
}