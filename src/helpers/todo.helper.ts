import _ from "lodash";
import type { TTodoBulkOperationResponseItem } from "#types";
import { ETodoBulkOperation } from "#constants";

function bulkDelete(todoIds: string[], todos: any[]) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos.splice(found, 1);
            successData.push({
                id: todoId,
                message: "Item removed successfully",
            });
        } else {
            errorData.push({
                id: todoId,
                message: "Item does not exist",
            });
        }
    });

    return {
        successData,
        errorData,
        todos,
    };
}

function bulkPin(todoIds: string[], todos: any[]) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos[found].isPinned = true;
            successData.push({
                id: todoId,
                message: "Item pinned successfully",
            });
        } else {
            errorData.push({
                id: todoId,
                message: "Item does not exist",
            });
        }
    });

    return {
        successData,
        errorData,
        todos,
    };
}

function bulkUnpin(todoIds: string[], todos: any[]) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos[found].isPinned = false;
            successData.push({
                id: todoId,
                message: "Item pinned successfully",
            });
        } else {
            errorData.push({
                id: todoId,
                message: "Item does not exist",
            });
        }
    });

    return {
        successData,
        errorData,
        todos,
    };
}

function bulkDone(todoIds: string[], todos: any[]) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos[found].isDone = true;
            successData.push({
                id: todoId,
                message: "Item marked as done successfully",
            });
        } else {
            errorData.push({
                id: todoId,
                message: "Item does not exist",
            });
        }
    });

    return {
        successData,
        errorData,
        todos,
    };
}

function bulkUndo(todoIds: string[], todos: any[]) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos[found].isDone = false;
            successData.push({
                id: todoId,
                message: "Item marked as not done successfully",
            });
        } else {
            errorData.push({
                id: todoId,
                message: "Item does not exist",
            });
        }
    });

    return {
        successData,
        errorData,
        todos,
    };
}

export function bulkTodoOperation(todoIds: string[], todos: any[], operation: ETodoBulkOperation) {
    let successData: TTodoBulkOperationResponseItem[] = [];
    let errorData: TTodoBulkOperationResponseItem[] = [];
    let operationResult;

    const allTodos = _.cloneDeep(todos);
    switch (operation) {
        case ETodoBulkOperation.DELETE:
            operationResult = bulkDelete(todoIds, allTodos);
            break;

        case ETodoBulkOperation.PIN:
            operationResult = bulkPin(todoIds, allTodos);
            break;

        case ETodoBulkOperation.UNPIN:
            operationResult = bulkUnpin(todoIds, allTodos);
            break;

        case ETodoBulkOperation.DONE:
            operationResult = bulkDone(todoIds, allTodos);
            break;

        case ETodoBulkOperation.NOT_DONE:
            operationResult = bulkUndo(todoIds, allTodos);
            break;
    }

    successData = operationResult?.successData ?? [];
    errorData = operationResult?.errorData ?? [];
    todos = operationResult?.todos ?? [];

    return { successData, errorData, todos };
}
