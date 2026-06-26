import { gql } from "@/api/graphql";
import type { User } from "@/types/social";
import { useState } from "react";

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
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestedUsers = async () => {
        setLoading(true);
        try {
            const { suggestedUsers } = await gql<{ suggestedUsers: User[] }>(
                `query {
                    suggestedUsers {
                        ${USER_FIELDS}
                        photo
                    }
                }`,
            );

            setSuggestedUsers(suggestedUsers);
        } catch (e) {
            throw e instanceof Error
                ? e
                : new Error("Failed to load suggested users");
        } finally {
            setLoading(false);
        }
    };

    const fetchMe = async (): Promise<User> => {
        const { me } = await gql<{ me: User }>(
            `query {
                me {
                    ${USER_FIELDS}
                }
            }`,
        );
        return me;
    };

    return {
        suggestedUsers,
        loading,
        fetchSuggestedUsers,
        fetchMe,
    };
}
