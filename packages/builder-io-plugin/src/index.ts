import type { BlocksField, Config } from "payload";

import pkg from "../package.json";
import { BuilderIoBlock } from "./blocks/builder-io-block";
import { uploadThemeHandler } from "./endpoints/upload-theme";
import { ThemesListField } from "./fields/ThemesListField";

export { importSymbolsInit } from "./hooks/import-page";

export interface BuilderIoConfig {
    collectionDesignSlug?: string;
    collectionOverrides?: any;
    collectionPagesSlug?: string;
    enabled?: boolean;
    privateKey?: string;
    publicKey?: string;
}

export const defaultConfig: BuilderIoConfig = {
    collectionDesignSlug: undefined,
    collectionOverrides: {},
    collectionPagesSlug: "pages",
    enabled: true,
    privateKey: process.env.BUILDER_IO_PRIVATE_KEY,
    publicKey: process.env.BUILDER_IO_PUBLIC_KEY,
};

export const builderIoPlugin =
    (pluginConfig: BuilderIoConfig = defaultConfig) =>
    (config: Config): Config => {
        const finalConfig: BuilderIoConfig = {
            ...defaultConfig,
            ...pluginConfig,
        };
        const { enabled } = finalConfig;

        const pagesCollection = config.collections?.find(
            (collection) => collection.slug === finalConfig.collectionPagesSlug
        );

        if (finalConfig.collectionDesignSlug) {
            const designCollection = config.collections?.find(
                (collection) =>
                    collection.slug === finalConfig.collectionDesignSlug
            );
            if (!designCollection || typeof designCollection !== "object") {
                throw new Error("Design collection not found");
            }
            designCollection.fields.push(ThemesListField);
            const editorModeField = designCollection.fields.find(
                (field) => (field as any).name === "editorMode"
            ) as BlocksField;
            if (editorModeField) {
                editorModeField.blocks.unshift(BuilderIoBlock);
            }

            if (!designCollection.endpoints) {
                designCollection.endpoints = [];
            }

            designCollection.endpoints.push({
                handler: uploadThemeHandler,
                method: "post",
                path: "/upload-theme/:themeId",
            });
        }

        // TODO: Remove this after we have a proper way to import pages
        // if (!pagesCollection || typeof pagesCollection !== "object") {
        //     throw new Error("Pages collection not found");
        // }

        // if (!pagesCollection.hooks) {
        //     pagesCollection.hooks = {};
        // }

        // if (!Array.isArray(pagesCollection.hooks.afterChange)) {
        //     pagesCollection.hooks.afterChange = [];
        // }

        // pagesCollection.hooks.afterChange.push(async ({ doc, operation }) => {
        //     if (operation !== "create") {
        //         return;
        //     }
        //     if (!finalConfig.privateKey || !finalConfig.publicKey) {
        //         throw new Error("Private or public API key is not set");
        //     }
        //     await importPageHook(
        //         finalConfig.privateKey,
        //         finalConfig.publicKey,
        //         doc.handle
        //     );
        // });

        if (!enabled) {
            return config;
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
