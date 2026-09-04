import { JWTVerifyResult } from 'jose';

export declare const blacklistedTokens: string[];
export declare const blacklistToken: (token: string) => void;
export declare const extractToken: (request: Request) => string | null;
export declare const generateJWT: (userId: number) => Promise<string>;
export declare const verifyJWT: (token: string) => Promise<JWTVerifyResult | null>;
export declare const authHandlers: import('msw').HttpHandler[];
