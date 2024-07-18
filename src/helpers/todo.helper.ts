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

export function bulkTodoOperation(todoIds: string[], todos: any[], operation: ETodoBulkOperation) {
    let successData: TTodoBulkOperationResponseItem[] = [];
    let errorData: TTodoBulkOperationResponseItem[] = [];
    let operationResult;

    const allTodos = _.cloneDeep(todos);
    switch (operation) {
        case ETodoBulkOperation.DELETE:
            operationResult = bulkDelete(todoIds, allTodos);
            successData = operationResult.successData;
            errorData = operationResult.errorData;
            todos = operationResult.todos;
            break;
    }

    return { successData, errorData, todos };
}
