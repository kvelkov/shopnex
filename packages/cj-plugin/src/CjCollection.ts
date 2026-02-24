import { EncryptedField } from "@shopnex/utils";
import { getTenantFromCookie } from "@shopnex/utils/helpers";
import {
    type CollectionBeforeChangeHook,
    type CollectionConfig,
    deepMergeWithCombinedArrays,
} from "payload";

import { syncProducts } from "./service/sync-products";
import { getProductId } from "./util/get-product-id";

export type CjCollectionProps = {
    overrides?: Partial<CollectionConfig>;
};

export type CjData = {
    accessToken?: string;
    accessTokenExpiry?: Date | string;
    apiToken?: string;
    emailAddress?: string;
    id: string;
    items: {
        productUrl: string;
    }[];
    pod?: {
        id: string;
        relationTo: "media";
    };
    refreshToken?: string;
    refreshTokenExpiry?: Date | string;
};

export const CjCollection = ({
    overrides = {},
}: CjCollectionProps): CollectionConfig => {
    const baseConfig: CollectionConfig = {
        slug: "cj-settings",
        access: {}, // will be deep-merged
        admin: {
            group: "Plugins",
            useAsTitle: "emailAddress",
        },
        fields: [
            {
                type: "collapsible",
                fields: [
                    {
                        type: "row",
                        fields: [
                            {
                                name: "emailAddress",
                                type: "email",
                            },
                            EncryptedField({
                                name: "apiToken",
                                type: "text",
                            }),
                        ],
                    },
                    {
                        type: "row",
                        fields: [
                            EncryptedField({
                                name: "refreshToken",
                                type: "text",
                            }),
                            {
                                name: "refreshTokenExpiry",
                                type: "date",
                            },
                        ],
                    },
                    {
                        type: "row",
                        fields: [
                            EncryptedField({
                                name: "accessToken",
                                type: "text",
                            }),
                            {
                                name: "accessTokenExpiry",
                                type: "date",
                            },
                        ],
                    },
                ],
                label: "Credentials",
            },
            {
                name: "pod",
                type: "upload",
                label: "Logo Area POD",
                relationTo: "media",
            },
            {
                name: "items",
                type: "array",
                admin: {
                    description:
                        "A list of product URLs to sync with CJ Dropshipping",
                },
                fields: [
                    {
                        name: "productUrl",
                        type: "text",
                    },
                ],
                label: "Products",
                labels: {
                    plural: "Product URLs",
                    singular: "Product URL",
                },
            },
        ],
        hooks: {
            beforeChange: [
                async ({ data, req }) => {
                    const productIds = data.items
                        ?.map((item: any) => {
                            const productId = getProductId(item.productUrl);
                            return productId;
                        })
                        .filter((productId) => typeof productId === "string");

                    if (!productIds) {return;}

                    const shopId = getTenantFromCookie(req.headers);

                    if (productIds.length > 0) {
                        await syncProducts({
                            data,
                            payload: req.payload,
                            productIds,
                            shopId: shopId as number,
                        });
                    }
                },
            ] as CollectionBeforeChangeHook<CjData>[],
        },
        labels: {
            plural: "CJ Dropshipping",
            singular: "CJ Dropshipping",
        },
    };

    return deepMergeWithCombinedArrays(baseConfig, overrides);
};
