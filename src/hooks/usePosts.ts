import { useState } from "react";
import { gql } from "@/api/graphql";
import type { Post, User } from "@/types/social";

const POST_FIELDS = `
    id
    title
    content
    image
    authorId
    author {
        id
        username
        firstName
        profileImage
    }
    likesCount
    likedByUsers {
        id
    }
    commentsCount
    creationDate
    modifiedDate
`;

interface CreatePostInput {
    title: string;
    content: string;
    image?: string;
}

interface UpdatePostInput {
    title?: string;
    content?: string;
    image?: string;
}

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const { allPosts } = await gql<{ allPosts: Post[] }>(`
                query {
                    allPosts {
                        ${POST_FIELDS}
                    }
                }
            `);

            setPosts(allPosts.sort((a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate)));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load posts");
        } finally {
            setLoading(false);
        }
    }

    const fetchPost = async (postId: number): Promise<Post> => {
        try {
            const { post } = await gql<{ post: Post }>(
                `query Post($postId: Int!) {
                    post(postId: $postId) {
                        ${POST_FIELDS}
                    }
                }`,
                { postId }
            );

            return post;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to load post");
        }
    }

    const createPost = async (input: CreatePostInput): Promise<Post> => {
        try {
            const { createPost } = await gql<{ createPost: Post }>(
                `mutation CreatePost($input: CreatePostInput!) {
                    createPost(input: $input) {
                        ${POST_FIELDS}
                    }
                }`,
                { input }
            );

            setPosts(prev => [createPost, ...prev]);

            return createPost;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to create post");
        }
    }

    const updatePost = async (postId: number, input: UpdatePostInput): Promise<Post> => {
        try {
            const { updatePost } = await gql<{ updatePost: Post }>(
                `mutation UpdatePost($postId: Int!, $input: UpdatePostInput!) {
                    updatePost(postId: $postId, input: $input) {
                        ${POST_FIELDS}
                    }
                }`,
                { postId, input }
            );

            setPosts(prev => prev.map(p => p.id === postId ? updatePost : p));

            return updatePost;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to update post");
        }
    }

    const deletePost = async (postId: number): Promise<void> => {
        try {
            await gql<{ deletePost: { success: boolean } }>(
                `mutation DeletePost($postId: Int!) {
                    deletePost(postId: $postId) {
                        success
                    }
                }`,
                { postId }
            );

            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to delete post");
        }
    }

    const toggleLike = async (postId: number, liked: boolean, user: User): Promise<void> => {
        const applyOptimistic = (posts: Post[]) => posts.map(post => {
            if (post.id !== postId) return post;

            return {
                ...post,
                likesCount: liked ? post.likesCount - 1 : post.likesCount + 1,
                likedByUsers: liked
                    ? post.likedByUsers.filter(u => u.id !== user.id)
                    : [...post.likedByUsers, user],
            };
        });

        const snapshot = posts;
        setPosts(prev => applyOptimistic(prev));

        try {
            const mutation = liked ? "dislikePost" : "likePost";
            await gql(`
                mutation ToggleLike($postId: Int!) {
                    ${mutation}(postId: $postId) {
                        id
                        likesCount
                        likedByUsers {
                            id
                        }
                    }
                }
            `, { postId });
        } catch (e) {
            setPosts(snapshot);
            throw e instanceof Error ? e : new Error("Failed to toggle like");
        }
    }

    return {
        posts,
        loading,
        error,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        toggleLike,
    }
}
