import type { AuthorizationServer } from "oauth4webapi";

export enum ErrorKind {
    BadRequest = "BadRequest",
    Conflict = "Conflict",
    InternalServer = "InternalServer",
    NotAuthenticated = "NotAuthenticated",
    NotAuthorized = "NotAuthorized",
    NotFound = "NotFound",
}

export enum SuccessKind {
    Created = "Created",
    Deleted = "Deleted",
    Retrieved = "Retrieved",
    Updated = "Updated",
}
export interface AuthPluginOutput {
    data: any;
    isError: boolean;
    isSuccess: boolean;
    kind: ErrorKind | SuccessKind;
    message: string;
}

/**
 * Generic OAuth provider callback output
 *
 * @interface OAuthProviderOutput
 * @internal
 */
interface OAuthProviderOutput {
    /**
     * OAuth Provider ID. Usually the slugified provider name
     *
     * @type {string}
     */
    id: string;
    /**
     * OAuth provider name. For example Google, Apple
     *
     * @type {string}
     */
    name: string;
    /**
     * Profile callback that returns account information requried to link with users
     *
     * @type {(
     *     profile: Record<string, string | number | boolean | object>,
     *   ) => AccountInfo}
     */
    profile: (
        profile: Record<string, boolean | number | object | string>
    ) => AccountInfo;

    /**
     * Scope of account attributes to request from the provider
     *
     * @type {string}
     */
    scope: string;
}

export interface OAuthBaseProviderConfig {
    /*
     * Oauth provider Client Type
     */
    client_auth_type?: "client_secret_basic" | "client_secret_post";
    client_id: string;
    client_secret?: string;
    /*
     * Additional parameters you would like to add to query for the provider
     */
    params?: Record<string, string>;
}

export interface OAuthProviderConfig
    extends OAuthProviderOutput,
        OAuthBaseProviderConfig {
    algorithm: "oauth2" | "oidc";
    authorization_server?: AuthorizationServer;
    issuer?: string;
    kind: "oauth";
}

export interface AccountInfo {
    email: string;
    name: string;
    passKey?: {
        backedUp: boolean;
        counter: number;
        credentialId: string;
        deviceType: string;
        publicKey?: Uint8Array;
        transports?: string[];
    };
    picture: string;
    sub: string;
}

export type PasswordProviderConfig = {
    id: string;
    kind: "password";
    // name: string
    // verfiyEmail?: boolean
    // passwordless?: boolean
    // mfa?: "OTP" | "TOTP" | "None"
    // signinCallback?: () => void
    // signupCallback?: () => void
};

export interface CredentialsAccountInfo {
    email: string;
    name: string;
}

export type PasskeyProviderConfig = {
    id: string;
    kind: "passkey";
};

export type ProvidersConfig =
    | OAuthProviderConfig
    | PasskeyProviderConfig
    | PasswordProviderConfig;

export type AuthenticationStrategy = "Cookie";
