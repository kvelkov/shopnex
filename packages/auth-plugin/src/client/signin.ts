import type { OauthProvider } from "./oauth";
import type { PasswordSigninPayload } from "./password";

import { oauth } from "./oauth";
import { init as passkeyInit } from "./passkey/index";
import { passwordSignin } from "./password";
interface BaseOptions {
    name: string;
}

export const appSignin = (options: BaseOptions) => {
    return {
        oauth: async (provider: OauthProvider) =>
            await oauth(options, provider),
        passkey: () => passkeyInit(),
        password: async (payload: PasswordSigninPayload) =>
            await passwordSignin(options, payload),
    };
};

export const adminSignin = () => {
    return {
        oauth: async (provider: OauthProvider) =>
            await oauth({ name: "admin" }, provider),
        passkey: () => {
            void passkeyInit();
        },
    };
};
