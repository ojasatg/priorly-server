import type { Request, Response } from "express";
import { getCurrentTimeStamp, useSleep } from "#utils/datetime.utils";
import { EServerResponseRescodes } from "#types/api.types";
import { logURL } from "#utils/logger.utils";
import _ from "lodash";

const TODOS = [
    {
        id: "abc",
        title: "Complete assignment",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sed turpis a fringilla. Etiam nec felis in dolor lobortis accumsan. Mauris convallis bibendum purus vel interdum. Cras finibus ligula et volutpat consectetur. Sed eros nunc, lacinia rutrum ornare vel, efficitur at sem. Integer id.",
        done: false,
        created: getCurrentTimeStamp() - 9999999,
        updated: getCurrentTimeStamp(),
        deadline: getCurrentTimeStamp() + 10000000,
        reminder: getCurrentTimeStamp(),
    },
    {
        id: "pqr",
        title: "Buy groceries",
        description: "Pick up vegetables and fruits from the market",
        done: true,
        created: getCurrentTimeStamp(),
        updated: getCurrentTimeStamp(),
        completed: getCurrentTimeStamp() + 20000000,
    },
    {
        id: "xyz",
        title: "Call client",
        description: "Discuss the new project requirements",
        done: false,
        created: getCurrentTimeStamp(),
        updated: getCurrentTimeStamp(),
        deadline: getCurrentTimeStamp(),
        reminder: getCurrentTimeStamp(),
    },
];

async function allTodos(req: Request, res: Response) {
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

async function createTodo(req: Request, res: Response) {
    logURL(req);
    await useSleep(2000);
    const newTodo = {
        id: "new",
        title: "A brand new todo",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sed turpis a fringilla. Etiam nec felis in dolor lobortis accumsan. Mauris convallis bibendum purus vel interdum.",
        done: false,
        created: getCurrentTimeStamp() - 9999999,
        updated: getCurrentTimeStamp(),
        deadline: getCurrentTimeStamp() + 10000000,
        reminder: getCurrentTimeStamp(),
    };
    TODOS.push(newTodo);

    res.status(201).json({
        rescode: EServerResponseRescodes.SUCCESS,
        message: "Todo created succesfully",
        data: {
            todo: newTodo,
        },
    });
}

async function deleteTodo(req: Request, res: Response) {
    logURL(req);
    const todoId = req.body.id;

    await useSleep(2000);

    const todoToDelete = _.find(TODOS, { id: todoId });
    if (_.isEmpty(todoToDelete)) {
        res.status(404).json({
            rescode: EServerResponseRescodes.ERROR,
            message: "Todo not found",
            error: "Requested item does not exist",
        });
    } else {
        _.remove(TODOS, { id: todoId });
        res.status(200).json({
            rescode: EServerResponseRescodes.SUCCESS,
            message: "Todo deleted successfully",
            data: {
                id: todoId,
            },
        });
    }
}

const TodoController = {
    allTodos,
    createTodo,
    deleteTodo,
};

export default TodoController;
