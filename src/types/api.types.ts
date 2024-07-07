export enum EServerResponseCodes {
    OK = 200,
    CREATED = 201,
    UPDATED = 204, // OR DELETED
    ACCEPTED = 202,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,

    MOVED = 301,

    INTERNAL_SERVER_ERROR = 500,
}

export enum EServerResponseRescodes {
    SUCCESS = 0,
    ERROR = 1,
    QUEUED = 2,
}

export type TAPIError = {
    code: EServerResponseRescodes.ERROR;
    message: string;
    error: string;
};

export type TAPISuccess<TData = undefined> = {
    code: EServerResponseRescodes.SUCCESS | EServerResponseRescodes.QUEUED;
    message: string;
    data?: TData;
};
