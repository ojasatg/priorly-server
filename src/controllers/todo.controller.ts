import type { Request, Response } from "express";
import _ from "lodash";
import { TodoSchema } from "#schemas";
import { getCurrentTimeStamp, logURL } from "#utils";
import { EServerResponseCodes, ETodoBulkOperation, EServerResponseRescodes } from "#constants";
import { bulkTodoOperation, getSelector } from "#helpers";
import { TodoModel } from "#models";

let TODOS = [
    {
        id: "1a2b3c4d",
        title: "Prepare research proposal",
        description:
            "Draft proposal outlining research objectives, methodology, and expected outcomes.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1648828800,
        reminder: 1648776000,
        isPinned: true,
        isDeleted: false,
    },
    {
        id: "5f6g7h8i",
        title: "Review code for performance improvements",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1858915200,
        reminder: 1648828800,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "9j0k1l2m",
        title: "Attend project kickoff meeting",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1858996800,
        reminder: 1648915200,
        isPinned: true,
        isDeleted: false,
    },
    {
        id: "3h4i5j6k",
        title: "Update project documentation",
        description:
            "Ensure all project documentation is up to date with recent changes and additions.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649083200,
        reminder: 1648996800,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "7l8m9n0o",
        title: "Organize team retrospective",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649164800,
        reminder: 1649083200,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "1p2q3r4s",
        title: "Research new software tools",
        description:
            "Explore and evaluate potential new software tools to streamline project workflows and enhance productivity.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649246400,
        reminder: 1649164800,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "5t6u7v8w",
        title: "Conduct user testing sessions",
        description:
            "Schedule and conduct user testing sessions to gather feedback on product usability.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649328000,
        reminder: 1649246400,
        isPinned: true,
        isDeleted: false,
    },
    {
        id: "9x0y1z2a",
        title: "Write unit tests for new features",
        description:
            "Develop unit tests to ensure the stability and functionality of newly implemented features.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649414400,
        reminder: 1649328000,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "3b4c5d6e",
        title: "Prepare presentation for client demo",
        description:
            "Create a compelling presentation to showcase project progress and upcoming milestones to the client.",
        isDone: false,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        deadline: 1649500800,
        reminder: 1649414400,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "7f8g9h0i",
        title: "Deploy latest version to staging server",
        description:
            "Push latest changes to staging environment for final testing before production deployment.",
        isDone: true,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        completedAt: 1649328000,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "1j2k3l4m",
        title: "Finalize budget report for Q3",
        isDone: true,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        completedAt: 1649414400,
        isPinned: false,
        isDeleted: false,
    },
    {
        id: "5n6o7p8q",
        title: "Conduct performance reviews with team members",
        description:
            "Schedule and conduct individual performance reviews with each team member to provide feedback and set goals.",
        isDone: true,
        createdAt: 1648656000,
        updatedAt: 1648657200,
        completedAt: 1649500800,
        isPinned: false,
        isDeleted: false,
    },
];

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

    // building filter
    const selector = getSelector(filters);

    try {
        const responseTodos = await TodoModel.find(selector);
        const todos = _.map(responseTodos, (todo) => {
            return TodoSchema.parse(todo);
        });

        res.status(EServerResponseCodes.OK).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todos fetched successfully",
            data: {
                todos: todos,
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
            message: "Unable to create todo",
            error: "Bad request: No changes sent to update",
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

        const oldTodo = await TodoModel.findByIdAndUpdate(todoId, changes);

        if (_.isEmpty(oldTodo)) {
            res.status(EServerResponseCodes.NOT_FOUND).json({
                rescode: EServerResponseRescodes.ERROR,
                message: "Unable to delete the todo",
                error: "Requested item does not exist",
            });
        } else {
            const updatedTodo = await TodoModel.findById(todoId);
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
    // always returns success with success and error operations

    const bulkOp = req.body.operation;

    if (!_.includes(_.values(ETodoBulkOperation), bulkOp)) {
        res.status(400).json({
            error: "Invalid operation",
            message: "Requested operation could not be completed",
        });
    }

    const bulkIds = req.body.ids;

    const { successData, errorData, todos } = bulkTodoOperation(bulkIds, TODOS, bulkOp);
    TODOS = todos;

    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Operation completed successfully",
        data: {
            success: successData,
            error: errorData,
        },
    });
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
    create,
    remove,
    details,
    edit,
    bulk,
};

export default TodoController;
