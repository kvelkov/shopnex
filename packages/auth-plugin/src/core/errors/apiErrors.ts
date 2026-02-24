import { ErrorKind } from "../../types";

const statusByKind = {
    [ErrorKind.BadRequest]: 400,
    [ErrorKind.Conflict]: 409,
    [ErrorKind.InternalServer]: 500,
    [ErrorKind.NotAuthenticated]: 401,
    [ErrorKind.NotAuthorized]: 403,
    [ErrorKind.NotFound]: 404,
};
export class AuthAPIError extends Response {
    constructor(message: string, kind: ErrorKind) {
        super(
            JSON.stringify({
                data: null,
                isError: true,
                isSuccess: false,
                kind,
                message,
            }),
            {
                status: statusByKind[kind],
            }
        );
    }
}

export class MissingEmailAPIError extends AuthAPIError {
    constructor() {
        super("Missing email. Email is required", ErrorKind.BadRequest);
    }
}

export class UserNotFoundAPIError extends AuthAPIError {
    constructor() {
        super("User not found", ErrorKind.NotFound);
    }
}

export class EmailNotFoundAPIError extends AuthAPIError {
    constructor() {
        super("Now user found with this email", ErrorKind.BadRequest);
    }
}

export class PasskeyVerificationAPIError extends AuthAPIError {
    constructor() {
        super("Passkey verification failed", ErrorKind.BadRequest);
    }
}

export class InvalidAPIRequest extends AuthAPIError {
    constructor() {
        super("Invalid API request", ErrorKind.BadRequest);
    }
}

export class UnauthorizedAPIRequest extends AuthAPIError {
    constructor() {
        super("Unauthorized access", ErrorKind.NotAuthorized);
    }
}

export class AuthenticationFailed extends AuthAPIError {
    constructor() {
        super("Authentication Failed", ErrorKind.NotAuthenticated);
    }
}

export class InvalidCredentials extends AuthAPIError {
    constructor() {
        super("Invalid Credentials", ErrorKind.BadRequest);
    }
}

export class InvalidRequestBodyError extends AuthAPIError {
    constructor() {
        super("Wrong request body. Missing parameters", ErrorKind.BadRequest);
    }
}

export class EmailAlreadyExistError extends AuthAPIError {
    constructor() {
        super("Email is already taken", ErrorKind.Conflict);
    }
}
