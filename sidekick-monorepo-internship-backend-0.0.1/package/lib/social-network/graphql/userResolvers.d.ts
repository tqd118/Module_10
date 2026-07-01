import { User, Post, Comment, Like } from '../types';

export declare const userResolvers: {
    Query: {
        me: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<User>;
        mePosts: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<Post[]>;
        meComments: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<Comment[]>;
        meCommentsCount: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<number>;
        meLikes: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<Like[]>;
        meLikesCount: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<number>;
        suggestedUsers: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<{
            id: number;
            username: string;
            description: string;
            photo: string | undefined;
        }[]>;
    };
    Mutation: {
        login: (_parent: any, { email, password }: any) => Promise<{
            token: string;
            user: User;
        }>;
        signup: () => boolean;
        logout: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => boolean;
        updateProfile: (_parent: any, { input }: any, { request }: {
            request: Request;
        }) => Promise<any>;
    };
};
