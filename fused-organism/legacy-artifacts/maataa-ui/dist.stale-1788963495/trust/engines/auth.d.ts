/**
 * Advanced Authentication Engine
 * Provides multi-factor authentication, passwordless auth, SSO, JWT/refresh tokens
 */
import type { MFAMethod } from "../types";
/**
 * Advanced Authentication Engine
 * Supports TOTP, SMS MFA, SSO, JWT, and token refresh
 */
export declare class AdvancedAuthEngine {
    private sessions;
    private mfaMethods;
    private jwtSecret;
    private refreshTokenTTL;
    constructor(jwtSecret?: string);
    /**
     * Authenticate user with credentials
     */
    authenticate(userId: string, password: string, ipAddress: string, userAgent: string): {
        token: string;
        refreshToken: string;
        sessionId: string;
    } | null;
    /**
     * Verify JWT token
     */
    verifyToken(token: string): {
        userId: string;
        sessionId: string;
    } | null;
    /**
     * Refresh authentication token
     */
    refreshToken(refreshToken: string, ipAddress: string): {
        token: string;
        refreshToken: string;
    } | null;
    /**
     * Enable MFA method for user
     */
    enableMFA(userId: string, method: "totp" | "sms" | "email"): MFAMethod;
    /**
     * Verify MFA code
     */
    verifyMFA(userId: string, mfaMethodId: string, code: string): boolean;
    /**
     * Get user's MFA methods
     */
    getUserMFAMethods(userId: string): MFAMethod[];
    /**
     * Invalidate session (logout)
     */
    invalidateSession(sessionId: string): void;
    /**
     * Generate JWT token
     */
    private generateJWT;
    /**
     * Generate refresh token
     */
    private generateRefreshToken;
}
/**
 * Passwordless Authentication Handler
 * Manages magic links and other passwordless authentication flows
 */
export declare class PasswordlessAuthHandler {
    private magicLinks;
    private magicLinkTTL;
    /**
     * Generate magic link for passwordless auth
     */
    generateMagicLink(userId: string): string;
    /**
     * Verify magic link token
     */
    verifyMagicLink(token: string): {
        userId: string;
    } | null;
    /**
     * Generate sign-up link for passwordless registration
     */
    generateSignUpLink(email: string): string;
}
//# sourceMappingURL=auth.d.ts.map