declare const apiHandlersNotes: (import('msw').HttpHandler | import('msw').GraphQLHandler)[];
export declare function startMockingNotes(repoName?: string): Promise<ServiceWorkerRegistration | undefined>;
export { apiHandlersNotes };
