import type {
    GenerateRegistrationOptionsOpts,
    RegistrationResponseJSON} from "@simplewebauthn/server";
import type { PayloadRequest } from "payload";

import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { parseCookies } from "payload";

import type { AccountInfo } from "../../../types";

import { PasskeyVerificationAPIError } from "../../errors/apiErrors";
import { MissingOrInvalidSession } from "../../errors/consoleErrors";
import { hashCode } from "../../utils/hash";

export async function GeneratePasskeyRegistration(
    request: PayloadRequest,
    rpID: string
): Promise<Response> {
    const { data } = (await request.json?.()) as { data: { email: string } };

    const registrationOptions: GenerateRegistrationOptionsOpts = {
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "required",
            userVerification: "required",
        },
        rpID,
        rpName: "Payload Passkey Webauth",
        supportedAlgorithmIDs: [-7, -257],
        timeout: 60000,
        userName: data.email,
    };
    const options = await generateRegistrationOptions(registrationOptions);
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

export async function VerifyPasskeyRegistration(
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
        const body = (await request.json?.()) as {
            data: { email: string; registration: RegistrationResponseJSON };
        };
        const verification = await verifyRegistrationResponse({
            expectedChallenge: challenge,
            expectedOrigin: request.payload.config.serverURL,
            expectedRPID: rpID,
            response: body.data.registration,
        });
        if (!verification.verified) {
            throw new PasskeyVerificationAPIError();
        }
        const { credential, credentialBackedUp, credentialDeviceType } =
            verification.registrationInfo;

        return await session_callback({
            name: "",
            email: body.data.email,
            passKey: {
                backedUp: credentialBackedUp,
                counter: credential.counter,
                credentialId: credential.id,
                deviceType: credentialDeviceType,
                publicKey: credential.publicKey,
                transports: credential.transports!,
            },
            picture: "",
            sub: hashCode(body.data.email + request.payload.secret).toString(),
        });
    } catch (error) {
        console.error(error);
        return Response.json({});
    }
}
