import type { Request, Response } from "express";
import _ from "lodash";
import { TodoBulkOperationRequestSchema, TodoChangesSchema, TodoSchema } from "#schemas";
import { getCurrentTimeStamp, logURL } from "#utils";
import {
    EServerResponseCodes,
    EServerResponseRescodes,
    ETodoBulkOperation,
    TODO_BULK_OPERATION_MESSAGES,
} from "#constants";
import { bulkOperation, getSelector } from "#helpers";
import { TodoModel } from "#models";

async function create(req: Request, res: Response) {
    logURL(req);
    const reqTodo = req.body;

    if (_.isEmpty(reqTodo)) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to create todo",
            error: "Bad request: Sufficient data not available",
        });
        return;
    }

    try {
        const createdTodo = await TodoModel.create(reqTodo);
        const todo = TodoSchema.parse(createdTodo); // strips unnecessary keys

        res.status(EServerResponseCodes.CREATED).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todo created succesfully",
            data: {
                todo: todo,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to add todo",
            error: "Internal Server Error",
        });
    }
}

async function details(req: Request, res: Response) {
    const todoId = req.query.id;

    if (!todoId) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to create todo",
            error: "Bad request: ID is required",
        });
        return;
    }

    try {
        const foundTodo = await TodoModel.findById(todoId);
        const todo = TodoSchema.parse(foundTodo);

        if (_.isEmpty(todo)) {
            res.status(EServerResponseCodes.NOT_FOUND).json({
                rescode: EServerResponseRescodes.ERROR,
                message: "Unable to fetch the todo details",
                error: "Requested item does not exist",
            });
        } else {
            res.status(EServerResponseCodes.OK).json({
                rescode: EServerResponseRescodes.SUCCESS,
                message: "Todo details fetched successfully",
                data: {
                    todo: todo,
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable fetch details",
            error: "Internal Server Error",
        });
    }
}

async function all(req: Request, res: Response) {
    logURL(req);

    const filters = req.query as Record<string, string>;
    if (_.isEmpty(filters)) {
        // making sure that we automatically fetch not deleted todos when we don't pass any filter
        filters["isDeleted"] = "false";
    }

    const cursor = Number(req.query.cursor) || 0;
    const limit = Number(req.query.limit) || 10;

    // building filter
    const selector = getSelector(filters);

    try {
        const responseTodos = await TodoModel.find(selector, null, { skip: cursor, limit }); // pagination logic with skip and limit
        const todos = _.map(responseTodos, (todo) => {
            return TodoSchema.parse(todo);
        });

        res.status(EServerResponseCodes.OK).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todos fetched successfully",
            data: {
                todos: todos,
                cursor: todos.length || -1,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to fetch todos",
            error: "Internal Server Error",
        });
    }
}

async function count(req: Request, res: Response) {
    logURL(req);

    const filters = req.query as Record<string, string>;
    if (_.isEmpty(filters)) {
        // making sure that we automatically fetch not deleted todos when we don't pass any filter
        filters["isDeleted"] = "false";
    }

    // building filter
    const selector = getSelector(filters);

    try {
        const count = await TodoModel.countDocuments(selector);

        res.status(EServerResponseCodes.OK).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todos fetched successfully",
            data: {
                count: count,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to fetch todos",
            error: "Internal Server Error",
        });
    }
}

async function edit(req: Request, res: Response) {
    const todoId = req.query.id as string; // taking id in query
    const changes = req.body.changes; // taking id in body, will require some extra work of processing the request.

    // res.status(500).json({
    //     error: "Custom error",
    //     message: "This is expected error",
    // });
    // return;

    if (!todoId) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to create todo",
            error: "Bad request: ID is required",
        });
        return;
    }
    if (_.isEmpty(changes)) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to update todos",
            error: "Bad request: No changes sent to update",
        });
        return;
    }

    if (
        (changes.isPinned && (changes.isDeleted || changes.isDone)) ||
        (changes.isDeleted && (changes.isDone || changes.isPinned)) ||
        (changes.isDone && (changes.isPinned || changes.isDeleted))
    ) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to update todos",
            error: "Bad request: Invalid state transition, cannot mark isPinned and isDone/isDeleted together",
        });
        return;
    }

    try {
        TodoChangesSchema.parse(changes);
    } catch (error) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to update todos",
            error: "Bad request: Changes contain invalid fields",
        });
        return;
    }

    try {
        // check for done and do other updates - not honouring whatever the pinned status sent or was, it will be set to false
        // if the todo was deleted, the same API gets called
        if (changes.isDone) {
            changes["isPinned"] = false;
            changes["reminder"] = null;
            changes["deadline"] = null;
            changes["completedOn"] = getCurrentTimeStamp();

            // make sure remove the reminders from google calendar
        }

        if (changes.isDeleted) {
            changes["deletedOn"] = getCurrentTimeStamp();
        } else {
            changes["deletedOn"] = null;
            changes["isDeleted"] = false;
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todoId,
            { $set: changes },
            { new: true }, // returns the updated todo otherwise old todo
        );

        if (_.isEmpty(updatedTodo)) {
            res.status(EServerResponseCodes.NOT_FOUND).json({
                rescode: EServerResponseRescodes.ERROR,
                message: "Unable to delete the todo",
                error: "Requested item does not exist",
            });
        } else {
            const todo = TodoSchema.parse(updatedTodo);
            res.status(EServerResponseCodes.OK).json({
                rescode: EServerResponseRescodes.SUCCESS,
                message: "Todo updated successfully",
                data: {
                    todo: todo,
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to update the todo details",
            error: "Internal Server Error",
        });
    }
}

async function bulk(req: Request, res: Response) {
    logURL(req);
    const bulkOp = req.body.operation;
    const bulkIds = req.body.ids;

    try {
        TodoBulkOperationRequestSchema.parse(req.body);
    } catch (error) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Bad request: Please try again later",
            error: "Invalid operation or invalid properties",
        });
        return;
    }

    // always returns success with success and error operations

    try {
        await bulkOperation(bulkIds, bulkOp);
        res.status(EServerResponseCodes.OK).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Operation completed successfully",
            data: {
                ids: bulkIds,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: TODO_BULK_OPERATION_MESSAGES[bulkOp as ETodoBulkOperation],
            error: "Internal Server Error",
        });
    }
}

async function remove(req: Request, res: Response) {
    logURL(req);
    const todoId = req.query.id as string;

    if (!todoId) {
        res.status(EServerResponseCodes.BAD_REQUEST).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to create todo",
            error: "Bad request: ID is required",
        });
        return;
    }

    try {
        const todo = await TodoModel.findByIdAndDelete(todoId);
        if (_.isEmpty(todo)) {
            res.status(EServerResponseCodes.NOT_FOUND).json({
                rescode: EServerResponseRescodes.ERROR,
                message: "Unable to delete the todo",
                error: "Requested item does not exist",
            });
        } else {
            res.status(EServerResponseCodes.OK).json({
                rescode: EServerResponseRescodes.SUCCESS,
                message: "Todo deleted successfully",
                data: {
                    id: todoId,
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(EServerResponseCodes.INTERNAL_SERVER_ERROR).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Unable to delete the todo",
            error: "Internal Server Error",
        });
    }
}

const TodoController = {
    all,
    count,
    create,
    remove,
    details,
    edit,
    bulk,
};

export default TodoController;
