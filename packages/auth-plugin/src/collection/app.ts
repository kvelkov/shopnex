import type { CollectionConfig, Field } from "payload";

import { MissingCollectionSlug } from "../core/errors/consoleErrors";

/**
 * A higher order function that takes the collection config for the argument
 * @param incomingCollection
 * @returns {CollectionConfig}
 */
export const withAppUsersCollection = (
    incomingCollection: {
        fields?: Field[] | undefined;
    } & Omit<CollectionConfig, "fields">
): CollectionConfig => {
    if (!incomingCollection.slug) {
        throw new MissingCollectionSlug();
    }

    const collectionConfig: CollectionConfig = {
        ...incomingCollection,
        fields: [],
    };

    const baseFields: Field[] = [
        {
            name: "name",
            type: "text",
        },
        {
            name: "email",
            type: "email",
            required: true,
            unique: true,
        },
        {
            name: "hashedPassword",
            type: "text",
            required: false,
        },
        {
            name: "salt",
            type: "text",
            required: false,
        },
        {
            name: "hashIterations",
            type: "number",
            required: false,
        },
    ];
    collectionConfig.fields = [
        ...baseFields,
        ...(incomingCollection.fields ?? []),
    ];
    collectionConfig.access = {
        admin: ({ req: { user } }) => Boolean(user),
        create: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
        read: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        ...(incomingCollection.access ?? {}),
    };
    collectionConfig.admin = {
        defaultColumns: ["name", "email"],
        useAsTitle: "name",
        ...incomingCollection.admin,
    };
    collectionConfig.timestamps = true;

    return collectionConfig;
};

/**
 * A higher order function that takes the collection config and a Users collection slug for the arguments
 * @param incomingCollection
 * @param userCollectionSlug
 * @returns {CollectionConfig}
 */
export const withAppAccountCollection = (
    incomingCollection: {
        fields?: Field[] | undefined;
    } & Omit<CollectionConfig, "fields">,
    usersCollectionSlug: string
): CollectionConfig => {
    if (!incomingCollection.slug) {
        throw new MissingCollectionSlug();
    }

    const collectionConfig: CollectionConfig = {
        ...incomingCollection,
        fields: [],
    };

    const baseFields: Field[] = [
        {
            name: "name",
            type: "text",
        },
        {
            name: "picture",
            type: "text",
        },
        {
            name: "user",
            type: "relationship",
            hasMany: false,
            label: "User",
            relationTo: usersCollectionSlug as any,
            required: true,
        },
        {
            name: "issuerName",
            type: "text",
            label: "Issuer Name",
            required: true,
        },
        {
            name: "scope",
            type: "text",
        },
        {
            name: "sub",
            type: "text",
            required: true,
        },
        {
            name: "passkey",
            type: "group",
            admin: {
                condition: (_data, peerData) => {
                    if (peerData.issuerName === "Passkey") {
                        return true;
                    }
                    return false;
                },
            },
            fields: [
                {
                    name: "credentialId",
                    type: "text",
                    required: true,
                },
                {
                    name: "publicKey",
                    type: "json",
                    required: true,
                },
                {
                    name: "counter",
                    type: "number",
                    required: true,
                },
                {
                    name: "transports",
                    type: "json",
                    required: true,
                },
                {
                    name: "deviceType",
                    type: "text",
                    required: true,
                },
                {
                    name: "backedUp",
                    type: "checkbox",
                    required: true,
                },
            ],
        },
    ];

    collectionConfig.fields = [
        ...baseFields,
        ...(incomingCollection.fields ?? []),
    ];

    collectionConfig.access = {
        admin: ({ req: { user } }) => Boolean(user),
        create: () => false,
        delete: () => true,
        read: ({ req: { user } }) => Boolean(user),
        update: () => false,
        ...(incomingCollection.access ?? {}),
    };
    collectionConfig.admin = {
        defaultColumns: ["issuerName", "scope", "user"],
        useAsTitle: "id",
        ...incomingCollection.admin,
    };
    collectionConfig.timestamps = true;
    return collectionConfig;
};
