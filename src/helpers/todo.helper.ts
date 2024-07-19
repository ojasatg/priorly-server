import _ from "lodash";
import type { TTodoBulkOperationResponseItem } from "#types";
import { ETodoBulkOperation } from "#constants";
import { getCurrentTimeStamp } from "#utils/datetime.utils";

const TODO_OPERATION_MESSAGES = {
    [ETodoBulkOperation.PIN]: "Item pinned successfully",
    [ETodoBulkOperation.UNPIN]: "Item unpinned successfully",
    [ETodoBulkOperation.DONE]: "Item marked as done successfully",
    [ETodoBulkOperation.NOT_DONE]: "Item marked as not done successfully",
    error: "Item not found",
};

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

function bulkToggle(todoIds: string[], todos: any[], operation: ETodoBulkOperation) {
    const errorData: TTodoBulkOperationResponseItem[] = [];
    const successData: TTodoBulkOperationResponseItem[] = [];

    if (operation === ETodoBulkOperation.DELETE) {
        // nothing for delete operation
        return { todos, successData, errorData };
    }
    // we get the field that we want to modify
    const fieldToBeOperated =
        operation === ETodoBulkOperation.PIN || operation === ETodoBulkOperation.UNPIN
            ? "isPinned"
            : "isDone";
    // we set the value to be set as true when the operation is pin or done otherwise it is false
    const valueToBeSet =
        operation === ETodoBulkOperation.PIN || operation === ETodoBulkOperation.DONE;

    _.forEach(todoIds, (todoId) => {
        const found = _.findIndex(todos, { id: todoId });
        if (found !== -1) {
            todos[found][fieldToBeOperated] = valueToBeSet;

            const todo = todos[found];
            if (todo.isDone && operation === ETodoBulkOperation.DONE) {
                if (todo.reminder) {
                    delete todo.reminder;
                }
                if (todo.deadline) {
                    delete todo.deadline;
                }
                todo.completedOn = getCurrentTimeStamp();
            }

            successData.push({
                id: todoId,
                message: TODO_OPERATION_MESSAGES[operation],
            });
        } else {
            errorData.push({
                id: todoId,
                message: TODO_OPERATION_MESSAGES.error,
            });
        }
    });

    return { todos, successData, errorData };
}

export function bulkTodoOperation(todoIds: string[], todos: any[], operation: ETodoBulkOperation) {
    let successData: TTodoBulkOperationResponseItem[] = [];
    let errorData: TTodoBulkOperationResponseItem[] = [];
    let operationResult;

    const allTodos = _.cloneDeep(todos);

    if (operation === ETodoBulkOperation.DELETE) {
        operationResult = bulkDelete(todoIds, allTodos);
    } else {
        operationResult = bulkToggle(todoIds, allTodos, operation);
    }

    successData = operationResult?.successData ?? [];
    errorData = operationResult?.errorData ?? [];
    todos = operationResult?.todos ?? [];

    return { successData, errorData, todos };
}

export function filterTodos(todos: any[], filters: { isDone: boolean; isPinned: boolean }) {
    const result = _.filter(todos, filters);
    return result;
}
