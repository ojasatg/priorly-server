import _ from "lodash";
import mongoose from "mongoose";
import { ETodoBulkOperation } from "#constants";
import { getCurrentTimeStamp } from "#utils";
import { TodoModel } from "#models";

export async function bulkOperation(todoIds: string[], operation: ETodoBulkOperation) {
    const objectIds = _.map(todoIds, (id) => new mongoose.Types.ObjectId(id));

    switch (operation) {
        // if pin or unpin operation is happening, it means todo is not done or not deleted.
        case ETodoBulkOperation.PIN:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                { $set: { isPinned: true, isDone: false, isDeleted: false } },
            );
            break;
        case ETodoBulkOperation.UNPIN:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                { $set: { isPinned: false, isDone: false, isDeleted: false } },
            );
            break;

        // if done/not done operation is happening, means we need to reset some values
        case ETodoBulkOperation.DONE:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                {
                    $set: {
                        isDone: true,
                        isPinned: false,
                        reminder: null,
                        deadline: null,
                        completedOn: getCurrentTimeStamp(),
                    },
                },
            );
            break;
        case ETodoBulkOperation.NOT_DONE:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                {
                    $set: {
                        isDone: false,
                        isPinned: false,
                        reminder: null,
                        deadline: null,
                    },
                },
            );
            break;

        // if delete operation is happening then we are resetting the pin status
        case ETodoBulkOperation.DELETE:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                {
                    $set: {
                        isDeleted: true,
                        isPinned: false,
                        deletedOn: getCurrentTimeStamp(),
                    },
                },
            );
            break;

        case ETodoBulkOperation.RECOVER:
            await TodoModel.updateMany(
                { _id: { $in: objectIds } },
                {
                    $set: {
                        isDeleted: false,
                        isPinned: false,
                        deletedOn: null,
                    },
                },
            );
            break;
    }
}

export function getSelector(filters?: Record<string, string>) {
    const selector: { isDone?: boolean; isPinned?: boolean; isDeleted?: boolean } = {};
    if (_.isEmpty(filters)) {
        return selector;
    }

    if (filters?.isDone === "true") {
        selector.isDone = true;
        selector.isDeleted = false;
    }
    if (filters?.isPinned === "true") {
        selector.isPinned = true;
        selector.isDeleted = false;
    }
    if (filters?.isDeleted === "true") {
        selector.isDeleted = true;
    }
    return selector;
}
