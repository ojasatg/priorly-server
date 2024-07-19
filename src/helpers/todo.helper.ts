import _ from "lodash";
import type { TTodoBulkOperationResponseItem } from "#types";
import { ETodoBulkOperation } from "#constants";

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

// function bulkPin(todoIds: string[], todos: any[]) {
//     const errorData: TTodoBulkOperationResponseItem[] = [];
//     const successData: TTodoBulkOperationResponseItem[] = [];

//     _.forEach(todoIds, (todoId) => {
//         const found = _.findIndex(todos, { id: todoId });
//         if (found !== -1) {
//             todos[found].isPinned = true;
//             successData.push({
//                 id: todoId,
//                 message: "Item pinned successfully",
//             });
//         } else {
//             errorData.push({
//                 id: todoId,
//                 message: "Item does not exist",
//             });
//         }
//     });

//     return {
//         successData,
//         errorData,
//         todos,
//     };
// }

// function bulkUnpin(todoIds: string[], todos: any[]) {
//     const errorData: TTodoBulkOperationResponseItem[] = [];
//     const successData: TTodoBulkOperationResponseItem[] = [];

//     _.forEach(todoIds, (todoId) => {
//         const found = _.findIndex(todos, { id: todoId });
//         if (found !== -1) {
//             todos[found].isPinned = false;
//             successData.push({
//                 id: todoId,
//                 message: "Item pinned successfully",
//             });
//         } else {
//             errorData.push({
//                 id: todoId,
//                 message: "Item does not exist",
//             });
//         }
//     });

//     return {
//         successData,
//         errorData,
//         todos,
//     };
// }

// function bulkDone(todoIds: string[], todos: any[]) {
//     const errorData: TTodoBulkOperationResponseItem[] = [];
//     const successData: TTodoBulkOperationResponseItem[] = [];

//     _.forEach(todoIds, (todoId) => {
//         const found = _.findIndex(todos, { id: todoId });
//         if (found !== -1) {
//             todos[found].isDone = true;
//             successData.push({
//                 id: todoId,
//                 message: "Item marked as done successfully",
//             });
//         } else {
//             errorData.push({
//                 id: todoId,
//                 message: "Item does not exist",
//             });
//         }
//     });

//     return {
//         successData,
//         errorData,
//         todos,
//     };
// }

// function bulkUndo(todoIds: string[], todos: any[]) {
//     const errorData: TTodoBulkOperationResponseItem[] = [];
//     const successData: TTodoBulkOperationResponseItem[] = [];

//     _.forEach(todoIds, (todoId) => {
//         const found = _.findIndex(todos, { id: todoId });
//         if (found !== -1) {
//             todos[found].isDone = false;
//             successData.push({
//                 id: todoId,
//                 message: "Item marked as not done successfully",
//             });
//         } else {
//             errorData.push({
//                 id: todoId,
//                 message: "Item does not exist",
//             });
//         }
//     });

//     return {
//         successData,
//         errorData,
//         todos,
//     };
// }

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
