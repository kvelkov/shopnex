import type { BasePayload, PayloadRequest } from "payload";

import type { AccountInfo } from "../../types";

import { UserNotFoundAPIError } from "../errors/apiErrors";
import { createSessionCookies, invalidateOAuthCookies } from "../utils/cookies";
import { hashCode } from "../utils/hash";
import { sessionResponse } from "../utils/session";

type Collections = {
    accountsCollectionSlug: string;
    usersCollectionSlug: string;
};

export class PayloadSession {
    readonly #allowSignUp: boolean;
    readonly #collections: Collections;
    constructor(collections: Collections, allowSignUp?: boolean) {
        this.#collections = collections;
        this.#allowSignUp = !!allowSignUp;
    }
    async #resolveShopID(
        userID: number | string,
        payload: BasePayload
    ): Promise<number | string> {
        const user = await payload.findByID({
            id: userID,
            collection: this.#collections.usersCollectionSlug as any,
        });

        // assuming shops[0] is the main one and has a `tenant` field
        const shopID = user.shops?.[0]?.shop?.id;

        return shopID;
    }
    async #upsertAccount(
        accountInfo: AccountInfo,
        scope: string,
        issuerName: string,
        payload: BasePayload
    ) {
        let userID: number | string;

        const userQueryResults = await payload.find({
            collection: this.#collections.usersCollectionSlug as any,
            where: {
                email: {
                    equals: accountInfo.email,
                },
            },
        });

        if (userQueryResults.docs.length === 0) {
            if (!this.#allowSignUp) {
                return new UserNotFoundAPIError();
            }

            console.log("Creating shop", "My Shop");
            const newShop = await payload.create({
                collection: "shops" as any,
                data: {
                    name: "My Shop",
                    handle: Math.random().toString(36).substring(2, 15),
                },
            });
            console.log("New shop created", newShop);
            console.log("Creating user", accountInfo);
            const newUser = await payload.create({
                collection: this.#collections.usersCollectionSlug as any,
                data: {
                    _verified: true,
                    email: accountInfo.email,
                    password: hashCode(
                        accountInfo.email + payload.secret
                    ).toString(),
                    shops: [
                        {
                            roles: ["shop-admin"],
                            shop: newShop.id,
                        },
                    ],
                },
                disableVerificationEmail: true,
            });
            console.log("User created", newUser);
            userID = newUser.id;
        } else {
            userID = userQueryResults.docs[0].id as string;
        }

        const accounts = await payload.find({
            collection: this.#collections.accountsCollectionSlug as any,
            where: {
                sub: { equals: accountInfo.sub },
            },
        });
        const data: Record<string, unknown> = {
            name: accountInfo.name,
            picture: accountInfo.picture,
            scope,
        };

        if (issuerName === "Passkey" && accountInfo.passKey) {
            data["passkey"] = {
                ...accountInfo.passKey,
            };
        }

        if (accounts.docs.length > 0) {
            data["sub"] = accountInfo.sub;
            data["issuerName"] = issuerName;
            data["user"] = userID;
            await payload.update({
                collection: this.#collections.accountsCollectionSlug as any,
                data,
                where: {
                    id: {
                        equals: accounts.docs[0].id,
                    },
                },
            });
        } else {
            const shopId = await this.#resolveShopID(userID as string, payload);
            data["shop"] = shopId;
            data["sub"] = accountInfo.sub;
            data["issuerName"] = issuerName;
            data["user"] = userID;
            await payload.create({
                collection: this.#collections.accountsCollectionSlug as any,
                data,
            });
        }
        return userID;
    }
    async createSession(
        accountInfo: AccountInfo,
        scope: string,
        issuerName: string,
        request: PayloadRequest,
        clientOrigin: string
    ) {
        const { payload } = request;

        const userID = await this.#upsertAccount(
            accountInfo,
            scope,
            issuerName,
            payload
        );

        const fieldsToSign = {
            id: userID,
            collection: this.#collections.usersCollectionSlug as any,
            email: accountInfo.email,
        };

        let cookies: string[] = [];
        cookies = [
            ...(await createSessionCookies(
                `${payload.config.cookiePrefix}-token`,
                payload.secret,
                fieldsToSign
            )),
        ];
        cookies = invalidateOAuthCookies(cookies);

        return sessionResponse(cookies, clientOrigin);
    }

    // In payload.ts, add this method
    async passwordSessionCallback(
        user: { id: string } & Pick<AccountInfo, "email">,
        payload: BasePayload,
        clientOrigin?: string
    ) {
        const fieldsToSign = {
            id: user.id,
            collection: this.#collections.usersCollectionSlug,
            email: user.email,
        };

        let cookies: string[] = [
            ...(await createSessionCookies(
                `${payload.config.cookiePrefix}-token`,
                payload.secret,
                fieldsToSign
            )),
        ];
        cookies = invalidateOAuthCookies(cookies);

        return sessionResponse(cookies, clientOrigin);
    }
}
