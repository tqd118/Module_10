declare const apiHandlersSocial: (import('msw').HttpHandler | import('msw').GraphQLHandler)[];
export declare function startMockingSocial(repoName?: string): Promise<ServiceWorkerRegistration | undefined>;
export { apiHandlersSocial };
