import { Post, Comment, User } from '../types';

export declare const postResolvers: {
    Post: {
        author: (post: Post) => User | undefined;
        likedByUsers: (post: Post) => User[];
        likesCount: (post: Post) => number;
        commentsCount: (post: Post) => number;
    };
    Query: {
        allPosts: () => Post[];
        post: (_parent: any, { id }: {
            id: number;
        }) => Post | undefined;
        allComments: () => Comment[];
        postComments: (_parent: any, { postId }: {
            postId: number;
        }, { request }: {
            request: Request;
        }) => Promise<Comment[]>;
    };
    Mutation: {
        createPost: (_parent: any, { input }: any, { request }: {
            request: Request;
        }) => Promise<Post>;
        updatePost: (_parent: any, { id, input }: any, { request }: {
            request: Request;
        }) => Promise<any>;
        deletePost: (_parent: any, { id }: {
            id: number;
        }, { request }: {
            request: Request;
        }) => Promise<boolean>;
        likePost: (_parent: any, { postId }: {
            postId: number;
        }, { request }: {
            request: Request;
        }) => Promise<Post>;
        dislikePost: (_parent: any, { postId }: {
            postId: number;
        }, { request }: {
            request: Request;
        }) => Promise<Post>;
        createComment: (_parent: any, { postId, text }: {
            postId: number;
            text: string;
        }, { request }: {
            request: Request;
        }) => Promise<Comment>;
        updateComment: (_parent: any, { id, text }: {
            id: number;
            text: string;
        }, { request }: {
            request: Request;
        }) => Promise<{
            text: string;
            modifiedDate: string;
            id: number;
            authorId: number;
            postId: number;
            creationDate: string;
        }>;
        deleteComment: (_parent: any, { id }: {
            id: number;
        }, { request }: {
            request: Request;
        }) => Promise<boolean>;
    };
};
