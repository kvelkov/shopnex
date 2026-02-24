import type { PayloadRequest } from "payload";

import type { AccountInfo } from "../../types";

import { InvalidAPIRequest } from "../errors/apiErrors";
import {
    GeneratePasskeyAuthentication,
    VerifyPasskeyAuthentication,
} from "../protocols/passkey/authentication";
import { InitPasskey } from "../protocols/passkey/index";
import {
    GeneratePasskeyRegistration,
    VerifyPasskeyRegistration,
} from "../protocols/passkey/registration";

export function PasskeyHandlers(
    request: PayloadRequest,
    resource: string,
    rpID: string,
    sessionCallBack: (accountInfo: AccountInfo) => Promise<Response>
): Promise<Response> {
    switch (resource) {
        case "generate-authentication-options":
            return GeneratePasskeyAuthentication(request, rpID);
        case "generate-registration-options":
            return GeneratePasskeyRegistration(request, rpID);
        case "init":
            return InitPasskey(request);
        case "verify-authentication":
            return VerifyPasskeyAuthentication(request, rpID, sessionCallBack);
        case "verify-registration":
            return VerifyPasskeyRegistration(request, rpID, sessionCallBack);
        default:
            throw new InvalidAPIRequest();
    }
}
