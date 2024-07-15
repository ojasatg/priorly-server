import type { Request, Response } from "express";
import { getCurrentTimeStamp, useSleep } from "#utils/datetime.utils";
import { EServerResponseRescodes } from "#types/api.types";
import { logURL } from "#utils/logger.utils";
import _ from "lodash";

const TODOS = [
    {
        id: "abc",
        title: "Complete assignment and do something",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sed turpis a fringilla. Etiam nec felis in dolor lobortis accumsan. Mauris convallis bibendum purus vel interdum. Cras finibus ligula et volutpat consectetur. Sed eros nunc, lacinia rutrum ornare vel, efficitur at sem. Integer id.",
        isDone: false,
        createdOn: getCurrentTimeStamp() - 9999999,
        updatedOn: getCurrentTimeStamp(),
        deadline: getCurrentTimeStamp() + 10000000,
        reminder: getCurrentTimeStamp(),
        isPinned: true,
    },
    {
        id: "pqr",
        title: "Buy groceries",
        description: "Pick up vegetables and fruits from the market",
        isDone: true,
        createdOn: getCurrentTimeStamp(),
        updatedOn: getCurrentTimeStamp(),
        completedOn: getCurrentTimeStamp() + 20000000,
        isPinned: false,
    },
    {
        id: "xyz",
        title: "Call client",
        description: "Discuss the new project requirements",
        isDone: false,
        createdOn: getCurrentTimeStamp(),
        updatedOn: getCurrentTimeStamp(),
        deadline: getCurrentTimeStamp(),
        reminder: getCurrentTimeStamp(),
        isPinned: false,
    },
    {
        id: "qwe",
        title: "Go shopping",
        description: "Buy shoes and clothes",
        isDone: false,
        createdOn: getCurrentTimeStamp() + 456789067,
        updatedOn: getCurrentTimeStamp() + 456789067,
        isPinned: false,
    },
];

async function all(req: Request, res: Response) {
    logURL(req);
    await useSleep(2000);
    res.status(200).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todos fetched successfully",
        data: {
            todos: TODOS,
        },
    });
}

async function create(req: Request, res: Response) {
    logURL(req);
    await useSleep(2000);

    const reqTodo = req.body;
    const newTodo = {
        ...reqTodo,
        id: "new",
        createdOn: getCurrentTimeStamp(),
        updatedOn: getCurrentTimeStamp(),
    };
    TODOS.unshift(newTodo);

    res.status(201).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todo created succesfully",
        data: {
            todo: newTodo,
        },
    });
}

async function details(req: Request, res: Response) {
    await useSleep(2000);
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
    await useSleep(2000);
    const todoId = req.query.id as string; // taking id in query
    const changes = req.body.changes; // taking id in body, will require some extra work of processing the request.

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
    const changedTodo = { ...todoToBeChanged, ...changes, updatedOn: getCurrentTimeStamp() };

    if (!changedTodo.isDone && !!changedTodo.completedOn) {
        delete changedTodo.completedOn;
        changedTodo.isPinned = false;
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

    await useSleep(2000);

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

const TodoController = {
    all,
    create,
    remove,
    details,
    edit,
};

export default TodoController;
