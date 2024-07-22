export enum ETodoBulkOperation {
    PIN,
    DONE,
    DELETE,
    NOT_DONE,
    UNPIN,
    RECOVER,
}

export enum ETodoType {
    PINNED = "pinned",
    DONE = "done",
    PENDING = "pending",
}

export enum ETodoFilter {
    isDone = "isDone",
    isPinned = "isPinned",
}

export const TODO_BULK_OPERATION_MESSAGES: { [key in ETodoBulkOperation]: string } = {
    [ETodoBulkOperation.PIN]: "Unable to pin the todos",
    [ETodoBulkOperation.DONE]: "Unable to mark the todos as done",
    [ETodoBulkOperation.DELETE]: "Unable to delete the todos",
    [ETodoBulkOperation.NOT_DONE]: "Unable to mark the todos as not done",
    [ETodoBulkOperation.UNPIN]: "Unable to unpin the todos",
    [ETodoBulkOperation.RECOVER]: "Unable to recover the todos",
};
