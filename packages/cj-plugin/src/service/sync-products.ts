import type { Product } from "@shopnex/types";
import type { BasePayload, Where } from "payload";

import {
    convertHTMLToLexical,
    editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import decimal from "decimal.js";
import { JSDOM } from "jsdom";

import type { CjData } from "../CjCollection";
import type { CjSdk} from "../sdk/cj-sdk";
import type { ProductDetails } from "../sdk/products/product-types";

import { cjSdk } from "../sdk/cj-sdk";
import { retrieveAccessToken } from "./access-token";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const upsertImage = async ({
    alt,
    filename,
    imageUrl,
    payload,
}: {
    alt: string;
    filename: string;
    imageUrl: string;
    payload: BasePayload;
}) => {
    const whereClause: Where = {
        filename: {
            equals: filename,
        },
    };

    const imageData = await payload.find({
        collection: "media",
        limit: 1,
        where: whereClause,
    });
    if (imageData.totalDocs === 0) {
        return payload.create({
            collection: "media",
            data: {
                alt,
                filename,
                thumbnailURL: imageUrl,
                url: imageUrl,
            },
        });
    }
    return imageData.docs[0];
};

async function mapMockProductToSchema({
    payload,
    product,
    sdk,
    shopId,
}: {
    payload: BasePayload;
    product: ProductDetails;
    sdk: CjSdk;
    shopId?: number;
}) {
    const variants: Product["variants"] = [];

    for (const variant of product.variants || []) {
        const filename = `${shopId}-${variant?.variantImage?.split("/").pop()}`;
        if (!filename || !variant.variantImage) {
            continue;
        }
        const alt = filename.split(".")[0];
        const imageUrl = variant.variantImage;
        const imageData = await upsertImage({
            alt,
            filename,
            imageUrl,
            payload,
        });

        const imageId = imageData.id;

        const data = await sdk.products.getProductStockByVid({
            vid: variant.vid,
        });
        if (!data.data) {
            throw new Error("Failed to fetch stock information");
        }
        const cjInventoryNum = data.data.reduce(
            (sum, item) => sum + (item?.cjInventoryNum || 0),
            0
        );

        variants.push({
            gallery: [+imageId],
            options: variant.variantKey?.split("-").map((key, index) => ({
                option: index === 0 ? "Color" : "Size",
                value: key,
            })),
            price: Number(
                new decimal(variant.variantSellPrice || 0).toNumber().toFixed(2)
            ),
            stockCount: cjInventoryNum,
            vid: variant.vid,
        });
    }

    const cleanHtml = product.description?.replace(/<img[^>]*>/g, "");

    return {
        description: convertHTMLToLexical({
            editorConfig: await editorConfigFactory.default({
                config: payload.config, // Your Payload Config
            }),
            html: cleanHtml || "<p></p>",
            JSDOM, // Pass in the JSDOM import; it's not bundled to keep package size small
        }) as any,
        pid: product.pid,
        source: "cj" as any,
        title: product.productNameEn,
        variants,
    };
}

const findProductById = async (productId: string, sdk: any) => {
    const result = await sdk.products.getProductDetails({
        pid: productId,
    });

    return result.data;
};

const createOrUpdateProduct = async ({
    payload,
    product,
    shopId,
}: {
    payload: BasePayload;
    product: Omit<Product, "createdAt" | "id" | "updatedAt">;
    shopId?: number;
}) => {
    const { totalDocs } = await payload.count({
        collection: "products",
        where: {
            pid: {
                equals: product.pid,
            },
        },
    });

    if (totalDocs === 0) {
        return payload.create({
            collection: "products",
            data: {
                ...product,
            },
        });
    }
};

export const syncProducts = async ({
    data,
    payload,
    productIds,
    shopId,
}: {
    data: Partial<CjData>;
    payload: BasePayload;
    productIds: string[];
    shopId?: number;
}) => {
    const accessToken = await retrieveAccessToken(data);
    const sdk = cjSdk({ accessToken });

    const fetchedProducts: ProductDetails[] = [];

    for (const productId of productIds) {
        const product = await findProductById(productId, sdk);
        if (product) {
            fetchedProducts.push(product);
        }
        await delay(1010); // throttle CJ API requests
    }

    // Wait for all async mapping to resolve
    const mappedProducts = await Promise.all(
        fetchedProducts.map((product) =>
            mapMockProductToSchema({ payload, product, sdk, shopId })
        )
    );

    // Create or update each mapped product
    await Promise.all(
        mappedProducts.map((product) =>
            createOrUpdateProduct({ payload, product, shopId })
        )
    );

    return fetchedProducts;
};
