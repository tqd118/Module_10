import { User } from '../types';

export declare const userResolvers: {
    Query: {
        me: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<User>;
    };
    Mutation: {
        login: (_parent: any, { email, password }: any) => Promise<{
            token: string;
            user: User;
        }>;
        signup: (_parent: any, { email, password }: any) => {
            message: string;
        };
        logout: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => {
            message: string;
        };
        updateProfile: (_parent: any, { input }: any, { request }: {
            request: Request;
        }) => Promise<any>;
    };
};
