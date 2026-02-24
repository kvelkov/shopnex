import type {
    BasePayload,
    Config,
    Endpoint,
    PayloadRequest,
    Plugin,
} from "payload";

import type { AccountInfo, ProvidersConfig } from "../types";

import {
    EndpointsFactory,
    OAuthEndpointStrategy,
    PasskeyEndpointStrategy,
} from "../core/endpoints";
import { InvalidServerURL } from "../core/errors/consoleErrors";
import { preflightCollectionCheck } from "../core/preflights/collections";
import { PayloadSession } from "../core/session/payload";
import { getOAuthProviders, getPasskeyProvider } from "../providers/utils";

interface PluginOptions {
    /*
     * Accounts collections config
     */
    accountsCollectionSlug: string;
    /* Enable or disable user creation. WARNING: If applied to your admin users collection it will allow ANYONE to sign up as an admin.
     * @default false
     */
    allowSignUp?: boolean;

    /* Enable or disable plugin
     * @default true
     */
    enabled?: boolean;

    /*
     * OAuth Providers
     */
    providers: ProvidersConfig[];
}

export const adminAuthPlugin =
    (pluginOptions: PluginOptions): Plugin =>
    async (incomingConfig: Config): Promise<Config> => {
        const config = { ...incomingConfig };

        if (pluginOptions.enabled === false) {
            return config;
        }

        // if (!config.serverURL) {
        //     throw new InvalidServerURL();
        // }

        const { accountsCollectionSlug, allowSignUp, providers } =
            pluginOptions;

        preflightCollectionCheck(
            [config.admin?.user!, accountsCollectionSlug],
            config.collections
        );

        config.admin = {
            ...(config.admin ?? {}),
        };

        const session = new PayloadSession(
            {
                accountsCollectionSlug,
                usersCollectionSlug: config.admin.user!,
            },
            allowSignUp
        );

        const oauthProviders = getOAuthProviders(providers);
        const passkeyProvider = getPasskeyProvider(providers);
        const passwordProvider = providers.find(
            (provider) => provider.kind === "password"
        );

        const endpointsFactory = new EndpointsFactory("admin");

        let oauthEndpoints: Endpoint[] = [];
        let passkeyEndpoints: Endpoint[] = [];
        const passwordEndpoints: Endpoint[] = [];

        if (Object.keys(oauthProviders).length > 0) {
            endpointsFactory.registerStrategy(
                "oauth",
                new OAuthEndpointStrategy(oauthProviders)
            );
            oauthEndpoints = endpointsFactory.createEndpoints("oauth", {
                sessionCallback: (
                    oauthAccountInfo: AccountInfo,
                    scope: string,
                    issuerName: string,
                    request: PayloadRequest,
                    clientOrigin: string
                ) =>
                    session.createSession(
                        oauthAccountInfo,
                        scope,
                        issuerName,
                        request,
                        clientOrigin
                    ),
            });
        }

        if (passkeyProvider) {
            endpointsFactory.registerStrategy(
                "passkey",
                new PasskeyEndpointStrategy()
            );
            passkeyEndpoints = endpointsFactory.createEndpoints("passkey");
        }

        if (passwordProvider) {
            const { PasswordAuthHandlers } = await import(
                "../core/routeHandlers/password"
            );

            passwordEndpoints.push(
                {
                    handler: async (req: PayloadRequest) => {
                        return PasswordAuthHandlers(
                            req,
                            "admin",
                            "signin",
                            { usersCollectionSlug: config.admin?.user! },
                            (user) =>
                                session.passwordSessionCallback(
                                    user,
                                    req.payload,
                                    req.query.origin as string
                                ),
                            req.payload.secret
                        );
                    },
                    method: "post",
                    path: "/admin/auth/signin",
                },
                {
                    handler: async (req: PayloadRequest) => {
                        return PasswordAuthHandlers(
                            req,
                            "admin",
                            "signup",
                            { usersCollectionSlug: config.admin?.user! },
                            (user) =>
                                session.passwordSessionCallback(
                                    user,
                                    req.payload,
                                    req.query.origin as string
                                ),
                            req.payload.secret
                        );
                    },
                    method: "post",
                    path: "/admin/auth/signup",
                },
                {
                    handler: async (req: PayloadRequest) => {
                        return PasswordAuthHandlers(
                            req,
                            "admin",
                            "forgot-password",
                            { usersCollectionSlug: config.admin?.user! },
                            (user) =>
                                session.passwordSessionCallback(
                                    user,
                                    req.payload,
                                    req.query.origin as string
                                ),
                            req.payload.secret,
                            req.query.stage as string
                        );
                    },
                    method: "post",
                    path: "/admin/auth/forgot-password",
                },
                {
                    handler: async (req: PayloadRequest) => {
                        return PasswordAuthHandlers(
                            req,
                            "admin",
                            "reset-password",
                            { usersCollectionSlug: config.admin?.user! },
                            (user) =>
                                session.passwordSessionCallback(
                                    user,
                                    req.payload,
                                    req.query.origin as string
                                ),
                            req.payload.secret
                        );
                    },
                    method: "post",
                    path: "/admin/auth/reset-password",
                }
            );
        }

        config.endpoints = [
            ...(config.endpoints ?? []),
            ...oauthEndpoints,
            ...passkeyEndpoints,
            ...passwordEndpoints,
        ];
        return config;
    };
