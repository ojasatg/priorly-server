import type { EServerResponseRescodes } from "#constants";

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
