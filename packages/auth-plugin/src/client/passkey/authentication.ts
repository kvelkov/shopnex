import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

import { startAuthentication } from "@simplewebauthn/browser";

export const authentication = async (
    passkey: {
        backedUp: boolean;
        counter: 0;
        credentialId: string;
        deviceType: string;
        publicKey: Uint8Array;
        transports: AuthenticatorTransportFuture[];
    },
    email: string
) => {
    const resp = await fetch(
        "/api/admin/passkey/generate-authentication-options",
        {
            body: JSON.stringify({ data: { passkey } }),
            method: "POST",
        }
    );
    const optionsJSON = await resp.json();
    try {
        const authenticationResp = await startAuthentication({
            // @ts-ignore
            optionsJSON: optionsJSON.options,
        });
        const response = await fetch(
            "/api/admin/passkey/verify-authentication",
            {
                body: JSON.stringify({
                    data: {
                        authentication: authenticationResp,
                        email,
                        passkey,
                    },
                }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            }
        );

        if (response.redirected) {
            window.location.href = response.url; // Redirect the user explicitly
        }
    } catch (error) {
        console.log(error);
    }
};
