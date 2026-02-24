import type { Config, SelectField } from "payload";

import type { CjCollectionProps} from "./CjCollection";

import pkg from "../package.json";
import { CjCollection } from "./CjCollection";
import { setTenantCredentials } from "./sdk/access-token";
import { createOrderHook } from "./service/create-order.hook";

interface PluginOptions {
    cjApiKey: string;
    cjEmailAddress: string;
    cjRefreshToken?: string;
    collectionOverrides?: CjCollectionProps["overrides"];
    isEnabled?: boolean;
    orderCollectionSlug?: string;
}

export const cjPlugin =
    (pluginOptions: PluginOptions) =>
    (config: Config): Config => {
        const isEnabled = pluginOptions.isEnabled ?? true;

        const ordersCollection = config.collections?.find(
            (collection) =>
                collection.slug ===
                (pluginOptions.orderCollectionSlug || "orders")
        );

        if (!ordersCollection) {
            throw new Error("No orders collection found");
        }

        if (!ordersCollection.hooks) {
            ordersCollection.hooks = {};
        }

        if (!ordersCollection.hooks?.afterChange?.length) {
            ordersCollection.hooks.afterChange = [];
        }
        config.collections?.push(
            CjCollection({
                overrides: pluginOptions.collectionOverrides,
            })
        );
        const productCollection = config.collections?.find(
            (collection) => collection.slug === "products"
        );

        const orderCollection = config.collections?.find(
            (collection) => collection.slug === "orders"
        );

        const productSourceField = productCollection?.fields?.find(
            (field) => (field as SelectField).name === "source"
        ) as SelectField;

        const orderSourceField = orderCollection?.fields?.find(
            (field) => (field as SelectField).name === "source"
        ) as SelectField;

        productSourceField.options.push({
            label: "CJ",
            value: "cj",
        });

        orderSourceField.options.push({
            label: "CJ",
            value: "cj",
        });

        if (!isEnabled) {
            return config;
        }
        if (ordersCollection.hooks?.afterChange) {
            ordersCollection.hooks.afterChange.push(createOrderHook);
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

            const cjSettingsDocs: any = [];

            const cjSettings = await payload.find({
                collection: "cj-settings" as any,
            });

            cjSettingsDocs.push(...cjSettings?.docs);

            cjSettingsDocs.forEach((config: any) => {
                setTenantCredentials(config?.shop?.slug || "1", {
                    emailAddress: config.email || process.env.CJ_EMAIL_ADDRESS,
                    password: config.apiToken || process.env.CJ_PASSWORD,
                });
            });
        };

        return config;
    };
