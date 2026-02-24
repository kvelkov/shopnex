import type { BlocksField, Config, Endpoint } from "payload";

import type { SanitizedStripePluginConfig, StripePluginConfig } from "./types";

import { StripeBlock } from "./blocks/StripeBlock";
import { stripeWebhooks } from "./routes/webhooks";

export { stripeCheckout } from "./services/stripe-checkout";
import pkg from "../package.json";

export const stripePlugin =
    (incomingStripeConfig: StripePluginConfig) =>
    (config: Config): Config => {
        const { collections } = config;

        // set config defaults here
        const pluginConfig: SanitizedStripePluginConfig = {
            ...incomingStripeConfig,
        };

        const endpoints: Endpoint[] = [
            ...(config?.endpoints || []),
            {
                handler: async (req) => {
                    const res = await stripeWebhooks({
                        config,
                        pluginConfig,
                        req,
                    });

                    return res;
                },
                method: "post",
                path: "/stripe/webhooks",
            },
        ];

        config.endpoints = endpoints;

        const paymentsCollection = collections?.find(
            (c) => c?.slug === incomingStripeConfig?.paymentCollectionSlug
        );

        if (paymentsCollection) {
            const providerField = paymentsCollection.fields.find(
                (f: any) => f.name === "providers"
            ) as BlocksField;
            providerField.blocks.push(
                StripeBlock({ secretAccess: pluginConfig.secretAccess })
            );
        }

        const incomingOnInit = config.onInit;

        config.onInit = async (payload) => {
            if (incomingOnInit) {
                await incomingOnInit(payload);
            }
            await config.custom?.syncPlugin?.(payload, {
                name: pkg.name,
                author: pkg.author,
                category: pkg.category,
                description: pkg.description,
                icon: pkg.icon,
                license: pkg.license,
                version: pkg.version,
            });
        };

        return config;
    };
