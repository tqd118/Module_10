import { HttpResponse } from 'msw';

interface ErrorBody {
    message: string;
}
interface AuthResult {
    userId: number;
    error?: undefined;
}
interface ErrorResult {
    userId?: undefined;
    error: HttpResponse<ErrorBody>;
}
export type VerificationResult = AuthResult | ErrorResult;
export declare const getUserIdFromAuthHeader: (requestHeaders: Headers) => Promise<VerificationResult>;
export {};
