import type { Block, FieldAccess } from "payload";

import { EncryptedField } from "@shopnex/utils";

export type SecretAccess = {
    create?: FieldAccess;
    read?: FieldAccess;
    update?: FieldAccess;
};

export const StripeBlock = ({
    secretAccess,
}: {
    secretAccess?: SecretAccess;
}): Block => ({
    slug: "stripe",
    admin: {
        disableBlockName: true,
    },
    fields: [
        {
            name: "providerName",
            type: "text",
            defaultValue: "Stripe",
            required: true,
        },
        {
            name: "testMode",
            type: "checkbox",
        },
        {
            name: "methodType",
            type: "select",
            admin: {
                readOnly: true,
            },
            defaultValue: "auto",
            options: [
                {
                    label: "Credit Card",
                    value: "card",
                },
                {
                    label: "Bank Transfer (ACH)",
                    value: "ach",
                },
                {
                    label: "Let Customer Choose (All Available)",
                    value: "auto",
                },
            ],
        },
        {
            type: "row",
            fields: [
                EncryptedField({
                    name: "stripeSecretKey",
                    type: "text",
                    access: secretAccess,
                    required: true,
                }),
                EncryptedField({
                    name: "stripeWebhooksEndpointSecret",
                    type: "text",
                    access: secretAccess,
                    required: true,
                }),
            ],
        },
        EncryptedField({
            name: "publishableKey",
            type: "text",
            access: secretAccess,
            required: true,
        }),
    ],
    imageURL: "https://cdn.shopnex.ai/shopnex-images/media/stripe.png",
    labels: {
        plural: "Stripe Providers",
        singular: "Stripe Provider",
    },
});
