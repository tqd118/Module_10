import { gql } from "@/api/graphql";
import type { Post, User } from "@/types/social";
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

    const [likes, setLikes] = useState<{creationDate: string}[]>([]);
    const [comments, setComments] = useState<{creationDate: string}[]>([]);
    const [posts, setPosts] = useState<{creationDate: string}[]>([]);


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


    const fetchUserLikes = async () => {
        const { meLikes } = await gql<{ meLikes: {creationDate: string}[] }>(
            `query {
                meLikes {
                    creationDate
                }
            }`,
        );
        setLikes(meLikes);
    }

    const fetchUserComments = async () => {
        const { meComments } = await gql<{ meComments: {creationDate: string}[] }>(
            `query {
                meComments {
                    creationDate
                }
            }`,
        );
        setComments(meComments);
    }

    const fetchUserPosts = async () => {
        const { mePosts } = await gql<{ mePosts: Post[] }>(
            `query {
                mePosts {
                    creationDate
                }
            }`,
        );
        setPosts(mePosts);
    }

    return {
        suggestedUsers,
        loading,
        fetchSuggestedUsers,
        fetchMe,
        fetchUserLikes,
        fetchUserComments,
        fetchUserPosts,
        likes,
        comments,
        posts
    };
}
