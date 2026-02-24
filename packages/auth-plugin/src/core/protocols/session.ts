import type { PayloadRequest } from "payload";

import { parseCookies } from "payload";

import { ErrorKind, SuccessKind } from "../../types";
import {
    UnauthorizedAPIRequest,
    UserNotFoundAPIError,
} from "../errors/apiErrors";
import { createSessionCookies, verifySessionCookie } from "../utils/cookies";

export const SessionRefresh = async (
    cookieName: string,
    secret: string,
    request: PayloadRequest
) => {
    const cookies = parseCookies(request.headers);
    const token = cookies.get(cookieName);
    if (!token) {
        return new UnauthorizedAPIRequest();
    }

    const jwtResponse = await verifySessionCookie(token, secret);
    if (!jwtResponse.payload) {
        return new UnauthorizedAPIRequest();
    }
    let refreshCookies: string[] = [];
    refreshCookies = [
        ...(await createSessionCookies(
            cookieName,
            secret,
            jwtResponse.payload
        )),
    ];

    const res = new Response(
        JSON.stringify({
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Updated,
            message: "Session refreshed",
        }),
        {
            status: 201,
        }
    );
    refreshCookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
    });
    return res;
};

export const UserSession = async (
    cookieName: string,
    secret: string,
    request: PayloadRequest,
    internal: {
        usersCollectionSlug: string;
    },
    fields: string[]
) => {
    const cookies = parseCookies(request.headers);
    const token = cookies.get(cookieName);
    console.log(cookies.get("payload-token"));

    if (!token) {
        return new Response(
            JSON.stringify({
                data: {
                    isAuthenticated: false,
                },
                kind: ErrorKind.NotAuthenticated,
                message: "Missing user session",
            }),
            {
                status: 403,
            }
        );
    }

    const jwtResponse = await verifySessionCookie(token, secret);
    if (!jwtResponse.payload) {
        return new Response(
            JSON.stringify({
                data: {
                    isAuthenticated: false,
                },
                isError: true,
                isSuccess: false,
                kind: ErrorKind.NotAuthenticated,
                message: "Invalid user session",
            }),
            {
                status: 401,
            }
        );
    }

    const doc = await request.payload.findByID({
        id: jwtResponse.payload.id,
        collection: internal.usersCollectionSlug as any,
    });
    if (!doc?.id) {
        return new UserNotFoundAPIError();
    }

    const queryData: Record<string, unknown> = {};
    fields.forEach((field) => {
        if (Object.hasOwn(doc, field)) {
            queryData[field] = doc[field];
        }
    });

    return new Response(
        JSON.stringify({
            data: {
                isAuthenticated: true,
                ...queryData,
            },
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Retrieved,
            message: "Fetched user session",
        }),
        {
            status: 201,
        }
    );
};
