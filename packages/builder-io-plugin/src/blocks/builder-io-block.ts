import type { Block } from "payload";

import { EncryptedField } from "@shopnex/utils";

export const BuilderIoBlock: Block = {
    slug: "builder-io",
    admin: {
        disableBlockName: true,
    },
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "builderIoPublicKey",
                    type: "text",
                    required: true,
                },
                EncryptedField({
                    name: "builderIoPrivateKey",
                    type: "text",
                    required: true,
                }),
            ],
        },
    ],
    imageURL: "/builder-io-logo.webp",
    labels: {
        plural: "Builder.io",
        singular: "Builder.io",
    },
};
