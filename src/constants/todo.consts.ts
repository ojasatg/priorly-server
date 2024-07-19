export enum ETodoBulkOperation {
    PIN,
    DONE,
    DELETE,
    NOT_DONE,
    UNPIN,
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
