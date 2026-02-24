import type { PayloadRequest } from "payload";

import { APP_COOKIE_SUFFIX } from "../../constants";
import { InvalidAPIRequest } from "../errors/apiErrors";
import {
    ForgotPasswordInit,
    ForgotPasswordVerify,
    PasswordSignin,
    PasswordSignup,
    ResetPassword,
} from "../protocols/password";

export function PasswordAuthHandlers(
    request: PayloadRequest,
    pluginType: string,
    kind: string,
    internal: {
        usersCollectionSlug: string;
    },
    sessionCallBack: (user: { email: string; id: string }) => Promise<Response>,
    secret: string,
    stage?: string
): Promise<Response> {
    switch (kind) {
        case "signin":
            return PasswordSignin(request, internal, sessionCallBack);
        case "signup":
            return PasswordSignup(request, internal, sessionCallBack);
        case "forgot-password":
            switch (stage) {
                case "init":
                    return ForgotPasswordInit(request, internal);
                case "verify":
                    return ForgotPasswordVerify(request, internal);
                default:
                    // eslint-disable-next-line @typescript-eslint/only-throw-error
                    throw new InvalidAPIRequest();
            }
        case "reset-password":
            return ResetPassword(
                `__${pluginType}-${APP_COOKIE_SUFFIX}`,
                secret,
                internal,
                request
            );
        default:
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new InvalidAPIRequest();
    }
}
