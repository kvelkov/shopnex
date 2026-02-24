import type {
    OAuthProviderConfig,
    PasskeyProviderConfig,
    PasswordProviderConfig,
    ProvidersConfig,
} from "../types";

import { ProviderAlreadyExists } from "../core/errors/consoleErrors";

/**
 * Simplified function to extract OAuth providers (Google and GitHub)
 *
 * @internal
 * @param {ProvidersConfig[]} providers
 * @returns {Record<string, OAuthProviderConfig>}
 */
export function getOAuthProviders(
    providers: ProvidersConfig[]
): Record<string, OAuthProviderConfig> {
    const records: Record<string, OAuthProviderConfig> = {};
    
    providers.forEach((provider) => {
        if (provider.kind === "oauth") {
            if (records[provider.id]) {
                throw new ProviderAlreadyExists();
            }
            records[provider.id] = provider;
        }
    });
    
    return records;
}

/**
 * Simplified function to get the Passkey provider
 */
export function getPasskeyProvider(
    providers: ProvidersConfig[]
): null | PasskeyProviderConfig {
    return providers.find(provider => provider.kind === "passkey") as PasskeyProviderConfig || null;
}

/**
 * Simplified function to get the Password provider
 */
export function getPasswordProvider(
    providers: ProvidersConfig[]
): null | PasswordProviderConfig {
    return providers.find(provider => provider.kind === "password") as PasswordProviderConfig || null;
}
