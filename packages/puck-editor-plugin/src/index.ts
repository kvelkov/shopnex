import type { Config } from "payload";

import pkg from "../package.json";
import { PuckPages } from "./collections/PuckPages";

type PuckEditorPluginConfig = {
    collectionOverrides?: any;
    enabled?: boolean;
};

export const puckEditorPlugin = (pluginConfig: PuckEditorPluginConfig = {}) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }

        config.collections?.push(
            PuckPages({ overrides: pluginConfig.collectionOverrides })
        );

        const onInit = config.onInit;
        config.onInit = async (payload) => {
            if (onInit) {
                await onInit(payload);
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

export default puckEditorPlugin;
