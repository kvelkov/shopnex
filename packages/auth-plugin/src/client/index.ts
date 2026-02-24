import { sign } from "crypto";

import type {
    ForgotPasswordPayload,
    PasswordRecoverPayload,
    PasswordResetPayload} from "./password";

import { MissingEnv } from "../core/errors/consoleErrors";
import {
    forgotPassword,
    passwordRecover,
    passwordReset
} from "./password";
import { refresh } from "./refresh";
import { adminSignin, appSignin } from "./signin";
import { adminSignup, appSignup } from "./signup";

interface AppClientOptions {
    name: string;
}

export const appClient = (options: AppClientOptions) => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
        throw new MissingEnv("NEXT_PUBLIC_SERVER_URL");
    }
    return {
        forgotPassword: async (payload: ForgotPasswordPayload) =>
            await forgotPassword(options, payload),
        passwordRecover: async (payload: PasswordRecoverPayload) =>
            await passwordRecover(options, payload),
        refresh: async () => await refresh(options),
        resetPassword: async (payload: PasswordResetPayload) =>
            await passwordReset(options, payload),
        signin: () => appSignin(options),
        signup: () => appSignup(options),
    };
};

export const adminClient = () => {
    return {
        signin: () => adminSignin(),
        signup: () => adminSignup(),
    };
};
