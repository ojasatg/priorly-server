import { TodoSchema } from "./../schemas/index";
import type { Request, Response } from "express";
import _ from "lodash";
import { getCurrentTimeStamp, useSleep } from "#utils/datetime.utils";
import { EServerResponseRescodes } from "#types/api.types";
import { ETodoBulkOperation } from "#constants";
import { logURL } from "#utils/logger.utils";
import { bulkTodoOperation } from "../helpers/todo.helper";
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

async function all(req: Request, res: Response) {
    logURL(req);
    const filters = req.query;
    let resTodos = _.filter(TODOS, { isDeleted: false });

    const _filters = {
        isDone: filters?.isDone === "true",
        isPinned: filters?.isPinned === "true",
        isDeleted: false,
    };

    if (!_.isEmpty(filters)) {
        resTodos = _.filter(TODOS, _filters) as typeof TODOS;
    }

    await useSleep(2000);

    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todos fetched successfully",
        data: {
            todos: resTodos,
        },
    });
}

async function allDeleted(req: Request, res: Response) {
    logURL(req);

    const resTodos = _.filter(TODOS, { isDeleted: true }) as typeof TODOS;

    await useSleep(2000);

    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todos fetched successfully",
        data: {
            todos: resTodos,
        },
    });
}

async function create(req: Request, res: Response) {
    try {
        logURL(req);
        const reqTodo = req.body;
        const createdTodo = await TodoModel.create(reqTodo);

        const todo = TodoSchema.parse(createdTodo);

        res.status(201).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todo created succesfully",
            data: {
                todo: todo,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Cannot create todo",
            error: "Internal Server Error",
        });
    }
}

async function details(req: Request, res: Response) {
    2000;
    const todoId = req.query.id;
    const responseTodo = _.find(TODOS, { id: todoId });

    if (_.isEmpty(responseTodo)) {
        res.status(404).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Cannot fetch the todo details",
            error: "Requested item does not exist",
        });
        return;
    }

    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todo details fetched successfully",
        data: {
            todo: responseTodo,
        },
    });
}

async function edit(req: Request, res: Response) {
    const todoId = req.query.id as string; // taking id in query
    const changes = req.body.changes; // taking id in body, will require some extra work of processing the request.

    if (!todoId) {
        res.status(400).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Bad request",
            error: "Id required in query params",
        });
        return;
    }

    const index = _.findIndex(TODOS, { id: todoId });

    if (index === -1) {
        res.status(404).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Cannot update the todo",
            error: "Requested item does not exist",
        });
        return;
    }

    const todoToBeChanged = TODOS[index];
    const changedTodo = { ...todoToBeChanged, ...changes, updatedAt: getCurrentTimeStamp() };

    if (changedTodo.isDone) {
        // if todo is updated as done, we remove the reminder and deadline keys
        if (changedTodo.reminder) {
            delete changedTodo.reminder;
        }
        if (changedTodo.deadline) {
            delete changedTodo.deadline;
        }

        changedTodo.completedAt = getCurrentTimeStamp();
    } else if (!changedTodo.isDone) {
        // if todo is updated as not done and has completedAt key, we delete it.
        if (changedTodo.completedAt) {
            delete changedTodo.completedAt;
        }
    }

    TODOS.splice(index, 1, changedTodo);

    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todo updated successfully",
        data: {
            todo: changedTodo,
        },
    });
}

async function remove(req: Request, res: Response) {
    logURL(req);
    const todoId = req.query.id as string;

    const todoToDelete = _.find(TODOS, { id: todoId });
    if (_.isEmpty(todoToDelete)) {
        res.status(404).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Cannot delete the todo",
            error: "Requested item does not exist",
        });
        return;
    }
    _.remove(TODOS, { id: todoId });
    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todo deleted successfully",
        data: {
            id: todoId,
        },
    });
}

async function bulk(req: Request, res: Response) {
    logURL(req);
    2000;
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

const TodoController = {
    all,
    create,
    remove,
    details,
    edit,
    bulk,
    allDeleted,
};

export default TodoController;
