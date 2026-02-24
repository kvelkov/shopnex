import type { AuthPluginOutput } from "../types";

interface BaseOptions {
    name: string;
}

export interface PasswordSigninPayload {
    email: string;
    password: string;
}
export const passwordSignin = async (
    opts: BaseOptions,
    payload: PasswordSigninPayload
): Promise<AuthPluginOutput> => {
    const response = await fetch(`/api/${opts.name}/auth/signin`, {
        body: JSON.stringify(payload),
        method: "POST",
    });

    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};

export interface PasswordSignupPayload {
    allowAutoSignin?: boolean;
    email: string;
    password: string;
    profile?: Record<string, unknown>;
}

export const passwordSignup = async (
    opts: BaseOptions,
    payload: PasswordSignupPayload
): Promise<AuthPluginOutput> => {
    const response = await fetch(`/api/${opts.name}/auth/signup`, {
        body: JSON.stringify(payload),
        method: "POST",
    });

    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};

export interface ForgotPasswordPayload {
    email: string;
}
export const forgotPassword = async (
    opts: BaseOptions,
    payload: ForgotPasswordPayload
): Promise<AuthPluginOutput> => {
    const response = await fetch(
        `/api/${opts.name}/auth/forgot-password?stage=init`,
        {
            body: JSON.stringify(payload),
            method: "POST",
        }
    );

    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};

export interface PasswordRecoverPayload {
    code: string;
    email: string;
    password: string;
}
export const passwordRecover = async (
    opts: BaseOptions,
    payload: PasswordRecoverPayload
): Promise<AuthPluginOutput> => {
    const response = await fetch(
        `/api/${opts.name}/auth/forgot-password?stage=verify`,
        {
            body: JSON.stringify(payload),
            method: "POST",
        }
    );

    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};

export interface PasswordResetPayload {
    email: string;
    password: string;
}
export const passwordReset = async (
    opts: BaseOptions,
    payload: PasswordResetPayload
): Promise<AuthPluginOutput> => {
    const response = await fetch(`/api/${opts.name}/auth/reset-password`, {
        body: JSON.stringify(payload),
        method: "POST",
    });

    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};
