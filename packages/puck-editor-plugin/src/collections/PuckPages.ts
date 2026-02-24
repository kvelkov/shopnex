import type { CollectionConfig} from "payload";

import { deepMergeWithCombinedArrays } from "payload";

export const PuckPages = ({
    overrides = {},
}: {
    overrides?: Partial<CollectionConfig>;
}): CollectionConfig => {
    const baseConfig: CollectionConfig = {
        slug: "puck-pages",
        admin: {
            defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
            group: "Plugins",
            useAsTitle: "title",
        },
        fields: [
            {
                type: "row",
                fields: [
                    {
                        name: "title",
                        type: "text",
                        defaultValue: "New Page",
                        required: true,
                    },
                    {
                        name: "handle",
                        type: "text",
                        defaultValue: "new-page",
                        required: true,
                    },
                ],
            },
            {
                name: "page",
                type: "json",
                admin: {
                    components: {
                        Field: "@shopnex/puck-editor-plugin/client#PuckEditor",
                    },
                },
                required: true,
            },
        ],
    };
    return deepMergeWithCombinedArrays(baseConfig, overrides);
};
