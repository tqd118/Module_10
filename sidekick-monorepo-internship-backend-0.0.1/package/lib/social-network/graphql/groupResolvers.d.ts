import { Group } from '../types';

export declare const groupResolvers: {
    Query: {
        allGroups: (_parent: any, _args: any, { request }: {
            request: Request;
        }) => Promise<Group[]>;
        group: (_parent: any, { id }: {
            id: number;
        }) => Group | undefined;
    };
    Mutation: {
        createGroup: (_parent: any, { input }: any, { request }: {
            request: Request;
        }) => Promise<Group>;
        updateGroup: (_parent: any, { id, input }: any, { request }: {
            request: Request;
        }) => Promise<any>;
        deleteGroup: (_parent: any, { id }: {
            id: number;
        }, { request }: {
            request: Request;
        }) => Promise<boolean>;
    };
};
