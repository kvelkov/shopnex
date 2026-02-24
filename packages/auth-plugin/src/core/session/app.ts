import type { BasePayload, JsonObject, PayloadRequest, TypeWithID } from "payload";

import type { AccountInfo, AuthenticationStrategy } from "../../types";

import { APP_COOKIE_SUFFIX } from "../../constants";
import { UserNotFoundAPIError } from "../errors/apiErrors";
import { createSessionCookies, invalidateOAuthCookies } from "../utils/cookies";
import { sessionResponse } from "../utils/session";

export class AppSession {
    constructor(
        private appName: string,
        private collections: {
            accountsCollection: string;
            usersCollection: string;
        },
        private allowAutoSignUp: boolean,
        private authenticationStrategy: AuthenticationStrategy,
        private secret: string
    ) {}

    private async oauthAccountMutations(
        userId: string,
        oauthAccountInfo: AccountInfo,
        scope: string,
        issuerName: string,
        payload: BasePayload
    ): Promise<JsonObject & TypeWithID> {
        const data: Record<string, unknown> = {
            name: oauthAccountInfo.name,
            issuerName,
            picture: oauthAccountInfo.picture,
            scope,
        };

        const accountRecords = await payload.find({
            collection: this.collections.accountsCollection as any,
            where: {
                sub: { equals: oauthAccountInfo.sub },
            },
        });

        if (accountRecords.docs && accountRecords.docs.length === 1) {
            return await payload.update({
                id: accountRecords.docs[0].id,
                collection: this.collections.accountsCollection as any,
                data,
            });
        } else {
            data["sub"] = oauthAccountInfo.sub;
            data["user"] = userId;
            return await payload.create({
                collection: this.collections.accountsCollection as any,
                data,
            });
        }
    }

    async oauthSessionCallback(
        oauthAccountInfo: AccountInfo,
        scope: string,
        issuerName: string,
        request: PayloadRequest,
        clientOrigin: string
    ) {
        const { payload } = request;
        const userRecords = await payload.find({
            collection: this.collections.usersCollection as any,
            where: {
                email: {
                    equals: oauthAccountInfo.email,
                },
            },
        });
        let userRecord: JsonObject & TypeWithID;
        if (userRecords.docs.length === 1) {
            userRecord = userRecords.docs[0];
        } else if (this.allowAutoSignUp) {
            const userRecords = await payload.create({
                collection: this.collections.usersCollection as any,
                data: {
                    email: oauthAccountInfo.email,
                },
            });
            userRecord = userRecords;
        } else {
            throw new UserNotFoundAPIError();
        }
        await this.oauthAccountMutations(
            userRecord["id"] as string,
            oauthAccountInfo,
            scope,
            issuerName,
            payload
        );

        let cookies: string[] = [];

        if (this.authenticationStrategy === "Cookie") {
            cookies = [
                ...(await createSessionCookies(
                    `__${this.appName}-${APP_COOKIE_SUFFIX}`,
                    this.secret,
                    {
                        id: userRecord["id"],
                        collection: this.collections.usersCollection,
                        email: oauthAccountInfo.email,
                    }
                )),
            ];
            cookies = invalidateOAuthCookies(cookies);
        }

        return sessionResponse(cookies, clientOrigin);
    }

    async passwordSessionCallback(
        user: { id: string } & Pick<AccountInfo, "email">
    ) {
        let cookies: string[] = [];

        if (this.authenticationStrategy === "Cookie") {
            cookies = [
                ...(await createSessionCookies(
                    `__${this.appName}-${APP_COOKIE_SUFFIX}`,
                    this.secret,
                    {
                        id: user.id,
                        collection: this.collections.usersCollection,
                        email: user.email,
                    }
                )),
            ];
            cookies = invalidateOAuthCookies(cookies);
        }

        return sessionResponse(cookies);
    }
}
