import { createAdminApiClient } from "@builder.io/admin-sdk";
import { builder } from "@builder.io/sdk";

import { getModelSchema } from "./schema";

const createModel = async ({
    modelName,
    privateKey,
}: {
    modelName: string;
    privateKey: string;
}) => {
    const adminSDK = createAdminApiClient(privateKey);
    const themeModel = getModelSchema({ name: modelName, subType: "page" });
    const model = await adminSDK.chain.mutation
        .addModel({ body: themeModel })
        .execute({ id: true });
    return model;
};

const isModelExists = async ({
    modelName,
    privateKey,
}: {
    modelName: string;
    privateKey: string;
}) => {
    const adminSDK = createAdminApiClient(privateKey);
    const models = await adminSDK.query({
        models: {
            id: true,
            name: true,
            fields: true,
        },
    });
    if (!models.data || !models.data.models) {
        return false;
    }
    const themeModelExists = models.data?.models.some(
        (model) => model.name === modelName
    );
    return themeModelExists;
};

async function importThemePage(
    modelName: string,
    privateKey: string,
    pageContent: any,
    logger: any
) {
    try {
        logger.debug("Importing page", {
            modelName,
            pageName: pageContent.name,
        });

        const response = await fetch(
            `https://builder.io/api/v1/write/${modelName}`,
            {
                body: JSON.stringify({
                    name: pageContent.name,
                    data: pageContent.data,
                    model: modelName,
                    published: pageContent.published ?? true,
                    query: pageContent.data?.url
                        ? [
                              {
                                  operator: "is",
                                  property: "urlPath",
                                  value: pageContent.data.url,
                              },
                          ]
                        : [],
                }),
                headers: {
                    Authorization: `Bearer ${privateKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
            }
        );

        const result = await response.json();

        if (response.ok) {
            logger.info("Successfully imported theme page", {
                modelName,
                pageName: pageContent.name,
            });
            return result;
        } else {
            logger.error("Error importing theme page", {
                error: result,
                modelName,
                pageName: pageContent.name,
            });
            return null;
        }
    } catch (error) {
        logger.error("Error during theme page import", {
            error,
            modelName,
            pageName: pageContent.name,
        });
        return null;
    }
}

const fetchPages = async ({
    publicKey,
    themeName,
}: {
    publicKey: string;
    themeName: string;
}) => {
    try {
        const pages = await builder.getAll(themeName, {
            apiKey: publicKey,
            limit: 100,
            options: {
                noTargeting: true,
            },
            userAttributes: {
                urlPath: "/",
            },
        });
        return pages;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
};

export const uploadTheme = async ({
    logger,
    privateKey,
    sourcePublicKey,
    themeName,
}: {
    logger: any;
    privateKey: string;
    sourcePublicKey: string;
    themeName: string;
}) => {
    try {
        logger.debug("Starting theme upload process", { themeName });

        const themeModelExists = await isModelExists({
            modelName: themeName,
            privateKey,
        });
        logger.debug("Theme model existence checked", {
            exists: themeModelExists,
            themeName,
        });

        if (!themeModelExists) {
            logger.info("Creating new theme model", { themeName });
            await createModel({
                modelName: themeName,
                privateKey,
            });
        }

        const symbolModelExists = await isModelExists({
            modelName: "symbol",
            privateKey,
        });
        logger.debug("Symbol model existence checked", {
            exists: symbolModelExists,
            themeName: "symbol",
        });

        if (!symbolModelExists) {
            logger.info("Creating new symbol model", { themeName: "symbol" });
            await createModel({
                modelName: "symbol",
                privateKey,
            });
        }

        logger.debug("Fetching pages for theme", { themeName });
        const [pages, symbols] = await Promise.all([
            fetchPages({
                publicKey: sourcePublicKey,
                themeName,
            }),
            fetchPages({
                publicKey: sourcePublicKey,
                themeName: "symbol",
            }),
        ]);
        logger.info("Retrieved theme content", {
            pageCount: pages.length,
            symbolCount: symbols.length,
            themeName,
        });

        const symbolImportPromises = symbols.map((symbol) => {
            logger.debug("Importing symbol", {
                symbolName: symbol.name,
                themeName,
            });
            return importThemePage("symbol", privateKey, symbol, logger);
        });

        await Promise.all(symbolImportPromises);
        logger.info("Symbols import completed", {
            symbolCount: symbols.length,
        });

        const pageImportPromises = pages.map((page) => {
            logger.debug("Importing theme page", {
                pageName: page.name,
                themeName,
            });
            return importThemePage(themeName, privateKey, page, logger);
        });

        await Promise.all(pageImportPromises);
        logger.info("Theme upload completed successfully", { themeName });

        return true;
    } catch (error) {
        logger.error("Error uploading theme", { error, themeName });
        return false;
    }
};
