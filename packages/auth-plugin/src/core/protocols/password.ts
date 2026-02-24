import type {
    CollectionSlug,
    PayloadRequest} from "payload";

import {
    getCookieExpiration,
    parseCookies
} from "payload";

import { EPHEMERAL_CODE_COOKIE_NAME } from "../../constants";
import { SuccessKind } from "../../types";
import {
    AuthenticationFailed,
    EmailAlreadyExistError,
    InvalidCredentials,
    InvalidRequestBodyError,
    UnauthorizedAPIRequest,
    UserNotFoundAPIError,
} from "../errors/apiErrors";
import {
    createSessionCookies,
    invalidateSessionCookies,
    verifySessionCookie,
} from "../utils/cookies";
import { ephemeralCode, verifyEphemeralCode } from "../utils/hash";
import { hashPassword, verifyPassword } from "../utils/password";
import { revokeSession } from "../utils/session";

export const PasswordSignin = async (
    request: PayloadRequest,
    internal: {
        usersCollectionSlug: string;
    },
    sessionCallBack: (user: { email: string; id: string }) => Promise<Response>
) => {
    const body =
        request.json &&
        ((await request.json?.()) as { email: string; password: string });

    if (!body?.email || !body.password) {
        return new InvalidRequestBodyError();
    }

    const { payload } = request;
    const { docs } = await payload.find({
        collection: internal.usersCollectionSlug,
        limit: 1,
        where: {
            email: { equals: body.email },
        },
    });

    if (docs.length !== 1) {
        return new UserNotFoundAPIError();
    }

    const user: any = docs[0];
    const isVerifed = await verifyPassword(
        body.password,
        user["hashedPassword"],
        user["salt"],
        user["hashIterations"]
    );
    if (!isVerifed) {
        return new InvalidCredentials();
    }
    return sessionCallBack({
        id: user.id as string,
        email: body.email,
    });
};

export const PasswordSignup = async (
    request: PayloadRequest,
    internal: {
        usersCollectionSlug: string;
    },
    sessionCallBack: (user: { email: string; id: string }) => Promise<Response>
) => {
    const { logger } = request.payload;
    const body =
        request.json &&
        ((await request.json?.()) as {
            allowAutoSignin?: boolean;
            email: string;
            password: string;
            profile?: Record<string, unknown>;
        });

    if (!body?.email || !body.password) {
        return new InvalidRequestBodyError();
    }

    const { payload } = request;
    const { docs } = await payload.find({
        collection: internal.usersCollectionSlug as any,
        limit: 1,
        where: {
            email: { equals: body.email },
        },
    });

    if (docs.length > 0) {
        return new EmailAlreadyExistError();
    }

    logger.info({ name: "My Shop" }, "Creating shop");
    const newShop = await payload.create({
        collection: "shops" as any,
        data: {
            name: "My Shop",
            handle: Math.random().toString(36).substring(2, 15),
        },
        req: request,
    });
    logger.debug({ newShop }, "New shop created");

    logger.info({ email: body.email }, "Creating user");
    const user = await payload.create({
        collection: internal.usersCollectionSlug as any,
        data: {
            email: body.email,
            password: body.password,
            shops: [
                {
                    roles: ["shop-admin"],
                    shop: newShop.id,
                },
            ],
            ...body.profile,
        },
        req: request,
        showHiddenFields: true,
    });
    logger.debug({ user }, "User created");

    logger.info("Creating account entry");
    await payload.create({
        collection: "admins" as any,
        data: {
            name: body.profile?.name || body.email.split("@")[0],
            issuerName: "Password",
            scope: "admin",
            shop: newShop.id,
            sub: body.email,
            user: user.id,
        },
        req: request,
    });

    if (body.allowAutoSignin) {
        return sessionCallBack({
            id: user.id as string,
            email: body.email,
        });
    }

    return Response.json(
        {
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Created,
            message: "Signed up successfully",
        },
        { status: 201 }
    );
};

export const ForgotPasswordInit = async (
    request: PayloadRequest,
    internal: {
        usersCollectionSlug: string;
    }
) => {
    const { payload } = request;

    const body =
        request.json &&
        ((await request.json?.()) as {
            email: string;
        });

    if (!body?.email) {
        return new InvalidRequestBodyError();
    }

    const { docs } = await payload.find({
        collection: internal.usersCollectionSlug as any,
        limit: 1,
        where: {
            email: { equals: body.email },
        },
    });

    if (docs.length !== 1) {
        return new UserNotFoundAPIError();
    }
    const { code, hash } = await ephemeralCode(6, payload.secret);

    await payload.sendEmail({
        subject: "Password recovery",
        text: "Password recovery code: " + code,
        to: body.email,
    });

    const res = new Response(
        JSON.stringify({
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Created,
            message: "Password recovery initiated successfully",
        }),
        { status: 201 }
    );
    const tokenExpiration = getCookieExpiration({
        seconds: 300,
    });
    res.headers.append(
        "Set-Cookie",
        `${EPHEMERAL_CODE_COOKIE_NAME}=${hash};Path=/;HttpOnly;Secure=true;SameSite=lax;Expires=${tokenExpiration.toUTCString()}`
    );
    return res;
};

export const ForgotPasswordVerify = async (
    request: PayloadRequest,
    internal: {
        usersCollectionSlug: string;
    }
) => {
    const { payload } = request;

    const body =
        request.json &&
        ((await request.json?.()) as {
            code: string;
            email: string;
            password: string;
        });

    if (!body?.email || !body?.password || !body.code) {
        return new InvalidRequestBodyError();
    }

    const cookies = parseCookies(request.headers);
    const hash = cookies.get(EPHEMERAL_CODE_COOKIE_NAME);
    if (!hash) {
        return new UnauthorizedAPIRequest();
    }

    const isVerified = await verifyEphemeralCode(
        body.code,
        hash,
        payload.secret
    );

    if (!isVerified) {
        return new AuthenticationFailed();
    }
    const { docs } = await payload.find({
        collection: internal.usersCollectionSlug as any,
        limit: 1,
        where: {
            email: { equals: body.email },
        },
    });

    if (docs.length !== 1) {
        return new UserNotFoundAPIError();
    }

    const {
        hash: hashedPassword,
        iterations,
        salt,
    } = await hashPassword(body.password);

    await payload.update({
        id: docs[0].id,
        collection: internal.usersCollectionSlug as any,
        data: {
            hashedPassword,
            hashIterations: iterations,
            salt,
        },
    });

    const res = new Response(
        JSON.stringify({
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Updated,
            message: "Password recovered successfully",
        }),
        { status: 201 }
    );
    res.headers.append(
        "Set-Cookie",
        `${EPHEMERAL_CODE_COOKIE_NAME}=;Path=/;HttpOnly;Secure=true;SameSite=lax;Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
    return res;
};

export const ResetPassword = async (
    cookieName: string,
    secret: string,
    internal: {
        usersCollectionSlug: string;
    },
    request: PayloadRequest
) => {
    const { payload } = request;
    const cookies = parseCookies(request.headers);
    const token = cookies.get(cookieName);
    if (!token) {
        return new UnauthorizedAPIRequest();
    }

    const jwtResponse = await verifySessionCookie(token, secret);
    if (!jwtResponse.payload) {
        return new UnauthorizedAPIRequest();
    }

    const body =
        request.json &&
        ((await request.json?.()) as {
            currentPassword: string;
            email: string;
            newPassword: string;
            signoutOnUpdate?: boolean | undefined;
        });

    if (!body?.email || !body?.currentPassword || !body?.newPassword) {
        return new InvalidRequestBodyError();
    }

    const { docs } = await payload.find({
        collection: internal.usersCollectionSlug as any,
        limit: 1,
        where: {
            email: { equals: body.email },
        },
    });

    if (docs.length !== 1) {
        return new UserNotFoundAPIError();
    }

    const user = docs[0];
    const isVerifed = await verifyPassword(
        body.currentPassword,
        user["hashedPassword"],
        user["salt"],
        user["hashIterations"]
    );
    if (!isVerifed) {
        return new InvalidCredentials();
    }

    const { iterations, salt } = await hashPassword(body.newPassword);

    await payload.update({
        id: user.id,
        collection: internal.usersCollectionSlug as any,
        data: {
            hashIterations: iterations,
            password: body.newPassword,
            salt,
        },
    });

    if (body.signoutOnUpdate) {
        let cookies: string[] = [];
        cookies = [...invalidateSessionCookies(cookieName, cookies)];
        return revokeSession(cookies);
    }

    const res = new Response(
        JSON.stringify({
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Updated,
            message: "Password reset complete",
        }),
        {
            status: 201,
        }
    );
    return res;
};
