import * as oauth from "oauth4webapi";
import { parseCookies, type PayloadRequest } from "payload";

import type { AccountInfo, OAuthProviderConfig } from "../../../types";

import { MissingOrInvalidSession } from "../../errors/consoleErrors";
import { getCallbackURL } from "../../utils/cb";

export async function UnifiedOAuthCallback(
    pluginType: string,
    request: PayloadRequest,
    providerConfig: OAuthProviderConfig,
    session_callback: (
        oauthAccountInfo: AccountInfo,
        clientOrigin: string
    ) => Promise<Response>
): Promise<Response> {
    const parsedCookies = parseCookies(request.headers);
    const code_verifier = parsedCookies.get("__session-code-verifier");
    
    const clientOrigin = parsedCookies.get("__session-client-origin") || 
                        parsedCookies.get("__client-origin");

    if (!code_verifier || !clientOrigin) {
        throw new MissingOrInvalidSession();
    }

    const { algorithm, client_auth_type, client_id, client_secret, profile } = providerConfig;
    const client: oauth.Client = { client_id };

    let as: oauth.AuthorizationServer;
    
    if (algorithm === "oidc" && providerConfig.issuer) {
        const issuer_url = new URL(providerConfig.issuer);
        as = await oauth
            .discoveryRequest(issuer_url, { algorithm })
            .then((response) => oauth.processDiscoveryResponse(issuer_url, response));
    } else if (algorithm === "oauth2" && providerConfig.authorization_server) {
        as = providerConfig.authorization_server;
    } else {
        throw new Error(`Invalid provider configuration for ${providerConfig.id}`);
    }

    const clientAuth = client_auth_type === "client_secret_basic"
        ? oauth.ClientSecretBasic(client_secret ?? "")
        : oauth.ClientSecretPost(client_secret ?? "");

    const current_url = new URL(request.url as string);
    const callback_url = getCallbackURL(
        request.payload.config.serverURL,
        pluginType,
        providerConfig.id
    );

    let params: URLSearchParams;
    
    if (algorithm === "oidc") {
        params = oauth.validateAuthResponse(as, client, current_url);
    } else {
        const state = parsedCookies.get("__session-oauth-state");
        params = oauth.validateAuthResponse(as, client, current_url, state);
    }

    const grantResponse = await oauth.authorizationCodeGrantRequest(
        as,
        client,
        clientAuth,
        params,
        callback_url.toString(),
        code_verifier
    );

    const body = (await grantResponse.json()) as { scope: string | string[] };
    let response = new Response(JSON.stringify(body), grantResponse);
    
    if (Array.isArray(body.scope)) {
        body.scope = body.scope.join(" ");
        response = new Response(JSON.stringify(body), grantResponse);
    }

    const token_result = await oauth.processAuthorizationCodeResponse(
        as,
        client,
        response,
        algorithm === "oidc" ? {
            expectedNonce: parsedCookies.get("__session-oauth-nonce") as string,
            requireIdToken: true,
        } : undefined
    );

    let userInfo: Record<string, any>;

    if (algorithm === "oidc") {
        const claims = oauth.getValidatedIdTokenClaims(token_result)!;
        const userInfoResponse = await oauth.userInfoRequest(
            as,
            client,
            token_result.access_token
        );
        const result = await oauth.processUserInfoResponse(
            as,
            client,
            claims.sub,
            userInfoResponse
        );
        userInfo = {
            name: result.name as string,
            email: result.email as string,
            picture: result.picture as string,
            sub: result.sub,
        };
    } else {
        const userInfoResponse = await oauth.userInfoRequest(
            as,
            client,
            token_result.access_token
        );
        userInfo = (await userInfoResponse.json()) as Record<string, string>;
        
        if (providerConfig.id === "github" && !userInfo.email) {
            const emailResponse = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${token_result.access_token}`,
                },
            });
            const emails = (await emailResponse.json()) as {
                email: string;
                primary: boolean;
                verified: boolean;
                visibility: null | string;
            }[];

            const primaryEmail = emails.find((e) => e.primary && e.verified);
            if (primaryEmail) {
                userInfo.email = primaryEmail.email;
            }
        }
    }

    return session_callback(profile(userInfo), clientOrigin);
}