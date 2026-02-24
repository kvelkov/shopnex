import type { CollectionConfig, Config } from "payload";

import pkg from "../package.json";
import { EmailTemplates } from "./collections/EmailTemplates";

type EmailChannelPluginConfig = {
    collectionOverrides?: Partial<CollectionConfig>;
    enabled?: boolean;
};

export const easyEmailPlugin = (pluginConfig: EmailChannelPluginConfig) => {
    return (config: Config): Config => {
        config.collections?.push(
            EmailTemplates({
                overrides: pluginConfig.collectionOverrides,
            })
        );
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
};

export default easyEmailPlugin;
