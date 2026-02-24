/**
 * The App plugin is used for authenticating users in the frontent app of the Payload CMS application.
 * It support magic link, password, OAuth, and Passkey based authentications.
 *
 * On top of it, to add additional security it also support 2FA using OTP, and TOTP.
 *
 * The set up is very lean and flexible to tailor the auth process in a specific way.
 *
 * ```ts
 * import {appAuthPlugin} from "payload-auth-plugin";
 *
 * // TODO: Need complete implementation
 *
 * ```
 * @packageDocumentation
 */

import type { Config, Endpoint, PayloadRequest, Plugin } from "payload";

import type {
    AccountInfo,
    AuthenticationStrategy,
    OAuthProviderConfig,
    PasskeyProviderConfig,
    PasswordProviderConfig,
} from "../types";

import {
    EndpointsFactory,
    OAuthEndpointStrategy,
    PasskeyEndpointStrategy,
    PasswordAuthEndpointStrategy,
    SessionEndpointStrategy,
} from "../core/endpoints";
import {
    InvalidServerURL,
    MissingEmailAdapter,
} from "../core/errors/consoleErrors";
import { preflightCollectionCheck } from "../core/preflights/collections";
import { AppSession } from "../core/session/app";
import { formatSlug } from "../core/utils/slug";
import {
    getOAuthProviders,
    getPasskeyProvider,
    getPasswordProvider,
} from "../providers/utils";

/**
 * The App plugin to set up authentication to the intengrated frontend of Payload CMS.
 *
 * Add the plugin to your Payload project plugins.
 *
 */
interface PluginOptions {
    /**
     * App user accounts collection slug.
     *
     * This collection will be used to store all the app user account records.
     * Multiple accounts can belong to one user
     *
     */
    accountsCollectionSlug: string;

    /**
     * Allow auto signup if user doesn't have an account.
     *
     * @default false
     *
     */
    allowAutoSignUp?: boolean | undefined;

    /**
     * Authentication strategies can be either JWT or Cookie based
     *
     * @default Cookie
     *
     */
    authenticationStrategy?: AuthenticationStrategy;

    /**
     * Enable or disable plugin
     *
     * @default true
     *
     */
    enabled?: boolean | undefined;

    /**
     * Unique name for your frontend app.
     *
     * This name will be used to created endpoints, tokens, and etc.
     */
    name: string;

    /**
     * Auth providers supported by the plugin
     *
     */
    providers: (
        | OAuthProviderConfig
        | PasskeyProviderConfig
        | PasswordProviderConfig
    )[];

    /**
     * Secret to use for JWT signing and decryption
     */
    secret: string;
    /**
     * @description
     * App users collection slug.
     *
     * This collection will be used to store all the app user records.
     *
     */
    usersCollectionSlug: string;
}

/**
 * App plugin funtion.
 *
 * @param {PluginOptions} pluginOptions
 * @returns {Plugin}
 */
export const appAuthPlugin =
    (pluginOptions: PluginOptions): Plugin =>
    (incomingConfig: Config): Config => {
        const config = { ...incomingConfig };

        if (pluginOptions.enabled === false) {
            return config;
        }

        // if (!config.serverURL) {
        //     throw new InvalidServerURL();
        // }

        const {
            accountsCollectionSlug,
            allowAutoSignUp,
            authenticationStrategy,
            providers,
            secret,
            usersCollectionSlug,
        } = pluginOptions;

        preflightCollectionCheck(
            [usersCollectionSlug, accountsCollectionSlug],
            config.collections
        );

        const name = formatSlug(pluginOptions.name);

        const oauthProviders = getOAuthProviders(providers);
        const passkeyProvider = getPasskeyProvider(providers);
        const passwordProvider = getPasswordProvider(providers);

        const session = new AppSession(
            name,
            {
                accountsCollection: accountsCollectionSlug,
                usersCollection: usersCollectionSlug,
            },
            allowAutoSignUp ?? false,
            authenticationStrategy ?? "Cookie",
            secret
        );

        const endpointsFactory = new EndpointsFactory(name);

        let oauthEndpoints: Endpoint[] = [];
        let passkeyEndpoints: Endpoint[] = [];
        let passwordEndpoints: Endpoint[] = [];

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
                    session.oauthSessionCallback(
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
            if (!config.email) {
                throw new MissingEmailAdapter();
            }
            endpointsFactory.registerStrategy(
                "password",
                new PasswordAuthEndpointStrategy(
                    { usersCollectionSlug },
                    secret
                )
            );
            passwordEndpoints = endpointsFactory.createEndpoints("password", {
                sessionCallback: (user: { email: string; id: string }) =>
                    session.passwordSessionCallback(user),
            });
        }

        endpointsFactory.registerStrategy(
            "session",
            new SessionEndpointStrategy(secret, { usersCollectionSlug })
        );
        const sessionEndpoints = endpointsFactory.createEndpoints("session");

        config.endpoints = [
            ...(config.endpoints ?? []),
            ...oauthEndpoints,
            ...passkeyEndpoints,
            ...passwordEndpoints,
            ...sessionEndpoints,
        ];
        return config;
    };
