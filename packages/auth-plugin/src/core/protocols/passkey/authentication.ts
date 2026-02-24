import type {
    AuthenticationResponseJSON,
    AuthenticatorTransportFuture,
    GenerateAuthenticationOptionsOpts} from "@simplewebauthn/server";
import type { PayloadRequest } from "payload";

import {
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { parseCookies } from "payload";

import type { AccountInfo } from "../../../types";

import { PasskeyVerificationAPIError } from "../../errors/apiErrors";
import { MissingOrInvalidSession } from "../../errors/consoleErrors";
import { hashCode } from "../../utils/hash";

export async function GeneratePasskeyAuthentication(
    request: PayloadRequest,
    rpID: string
): Promise<Response> {
    const { data } = (await request?.json?.()) as {
        data: {
            passkey: {
                backedUp: boolean;
                counter: number;
                credentialId: string;
                deviceType: string;
                publicKey: Uint8Array;
                transports: AuthenticatorTransportFuture[];
            };
        };
    };

    const registrationOptions: GenerateAuthenticationOptionsOpts = {
        allowCredentials: [
            {
                id: data.passkey.credentialId,
                transports: data.passkey.transports,
            },
        ],
        rpID,
        timeout: 60000,
        userVerification: "required",
    };
    const options = await generateAuthenticationOptions(registrationOptions);
    const cookieMaxage = new Date(Date.now() + 300 * 1000);
    const cookies: string[] = [];
    cookies.push(
        `__session-webpk-challenge=${options.challenge};Path=/;HttpOnly;SameSite=lax;Expires=${cookieMaxage.toUTCString()}`
    );
    const res = new Response(JSON.stringify({ options }), { status: 201 });
    cookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
    });
    return res;
}

export async function VerifyPasskeyAuthentication(
    request: PayloadRequest,
    rpID: string,
    session_callback: (accountInfo: AccountInfo) => Promise<Response>
): Promise<Response> {
    try {
        const parsedCookies = parseCookies(request.headers);

        const challenge = parsedCookies.get("__session-webpk-challenge");
        if (!challenge) {
            throw new MissingOrInvalidSession();
        }
        const { data } = (await request.json?.()) as {
            data: {
                authentication: AuthenticationResponseJSON;
                email: string;
                passkey: {
                    backedUp: boolean;
                    counter: 0;
                    credentialId: string;
                    deviceType: string;
                    publicKey: Record<string, number>;
                    transports: AuthenticatorTransportFuture[];
                };
            };
        };

        const verification = await verifyAuthenticationResponse({
            credential: {
                id: data.passkey.credentialId,
                counter: data.passkey.counter,
                publicKey: new Uint8Array(
                    Object.values(data.passkey.publicKey)
                ),
                transports: data.passkey.transports,
            },
            expectedChallenge: challenge,
            expectedOrigin: request.payload.config.serverURL,
            expectedRPID: rpID,
            response: data.authentication,
        });
        if (!verification.verified) {
            throw new PasskeyVerificationAPIError();
        }
        const {
            credentialBackedUp,
            credentialDeviceType,
            credentialID,
            newCounter,
        } = verification.authenticationInfo;
        return await session_callback({
            name: "",
            email: data.email,
            passKey: {
                backedUp: credentialBackedUp,
                counter: newCounter,
                credentialId: credentialID,
                deviceType: credentialDeviceType,
            },
            picture: "",
            sub: hashCode(data.email + request.payload.secret).toString(),
        });
    } catch (error) {
        console.error(error);
        return Response.json({});
    }
}
