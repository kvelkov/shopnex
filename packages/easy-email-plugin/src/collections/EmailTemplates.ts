import type { CollectionConfig} from "payload";

import { deepMergeWithCombinedArrays } from "payload";

type EmailTemplatesProps = {
    overrides?: Partial<CollectionConfig>;
};

export const EmailTemplates = ({
    overrides = {},
}: EmailTemplatesProps): CollectionConfig => {
    const baseConfig: CollectionConfig = {
        slug: "email-templates",
        admin: {
            components: {
                views: {
                    edit: {
                        default: {
                            Component:
                                "@shopnex/easy-email-plugin/client#EmailTemplateEditView",
                        },
                    },
                },
            },
            group: "Plugins",

            defaultColumns: ["name", "createdAt", "updatedAt"],
            useAsTitle: "name",
        },
        fields: [
            // {
            //     name: "emailEditor",
            //     type: "ui",
            //     admin: {
            //         components: {
            //             Fields: {
            //                 path: "@shopnex/easy-email-plugin/client#EmailTemplateEditView",
            //             },
            //             Field: {
            //                 path: "@shopnex/easy-email-plugin/client#EmailTemplateEditView",
            //             },
            //         },
            //     },
            // },
            { name: "name", type: "text" },
            {
                name: "html",
                type: "textarea",
                admin: {
                    disabled: true,
                },
            },
            {
                name: "json",
                type: "json",
            },
        ],
    };
    return deepMergeWithCombinedArrays(baseConfig, overrides);
};
