import { useState, useCallback } from "react";
import { gql } from "@/api/graphql";
import type { Comment } from "@/types/social";

const COMMENT_FIELDS = `
    id
    text
    authorId
    postId
    creationDate
    modifiedDate
`;

interface UpdateCommentInput {
    text: string;
}

export function useComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPostComments = useCallback(async (postId: number) => {
        setLoading(true);
        setError(null);

        try {
            const { postComments } = await gql<{ postComments: Comment[] }>(
                `query PostComments($postId: Int!) {
                    postComments(postId: $postId) {
                        ${COMMENT_FIELDS}
                    }
                }`,
                { postId }
            );

            setComments(postComments);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load comments");
        } finally {
            setLoading(false);
        }
    }, []);

    const createComment = async (postId: number, text: string): Promise<Comment> => {
        const { createComment } = await gql<{ createComment: Comment }>(
            `mutation CreateComment($postId: Int!, $text: String!) {
                createComment(postId: $postId, text: $text) {
                    id
                    text
                    authorId
                    postId
                    creationDate
                    modifiedDate
                }
            }`,
            { postId, text }
        );

        setComments(prev => [...prev, createComment]);
        return createComment;
    }

    const updateComment = async (commentId: number, input: UpdateCommentInput): Promise<Comment> => {
        try {
            const { updateComment } = await gql<{ updateComment: Comment }>(
                `mutation UpdateComment($commentId: Int!, $input: UpdateCommentInput!) {
                    updateComment(commentId: $commentId, input: $input) {
                        ${COMMENT_FIELDS}
                    }
                }`,
                { commentId, input }
            );

            setComments(prev => prev.map(c => c.id === commentId ? updateComment : c));

            return updateComment;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to update comment");
        }
    }

    const deleteComment = async (commentId: number): Promise<void> => {
        try {
            await gql<{ deleteComment: { success: boolean } }>(
                `mutation DeleteComment($commentId: Int!) {
                    deleteComment(commentId: $commentId) {
                        success
                    }
                }`,
                { commentId }
            );

            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to delete comment");
        }
    }

    return {
        comments,
        loading,
        error,
        fetchPostComments,
        createComment,
        updateComment,
        deleteComment,
    }
}
