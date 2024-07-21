import { ETodoBulkOperation } from "#constants";
import { z } from "zod";

export const LabelSchema = z.object({
    name: z.string(),
    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid color")
        .nullish(),
});

export const TodoSchema = z.object({
    id: z.string(),
    title: z
        .string()
        .min(1, "Title is required")
        .max(60, "Title cannot be more than 60 characters"),

    description: z
        .string()
        .max(150, "Description cannot be more than 150 characters long")
        .nullish(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid color")
        .nullish(),
    labels: z.array(LabelSchema).nullish(),
    priority: z.string().nullish(),
    isDone: z.boolean(),
    isPinned: z.boolean(),
    isDeleted: z.boolean(),
    createdOn: z.number(),
    updatedOn: z.number(),
    completedOn: z.number().nullish(),
    deletedOn: z.number().nullish(),
});

export const TodoChangesSchema = z
    .object({
        title: z
            .string()
            .min(1, "Title is required")
            .max(60, "Title cannot be more than 60 characters"),

        description: z
            .string()
            .max(150, "Description cannot be more than 150 characters long")
            .nullish(),
        deadline: z.number().nullish(),
        reminder: z.number().nullish(),
        color: z
            .string()
            .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid color")
            .nullish(),
        labels: z.array(LabelSchema).nullish(),
        priority: z.string().nullish(),
        isDone: z.boolean(),
        isPinned: z.boolean(),
        isDeleted: z.boolean(),
    })
    .strict()
    .partial();

export const TodoBulkOperationRequestSchema = z
    .object({
        ids: z.array(z.string()),
        operation: z.nativeEnum(ETodoBulkOperation),
    })
    .strict();

export type TTodoSchema = z.infer<typeof TodoSchema>;
export type TLabelSchema = z.infer<typeof LabelSchema>;
export type TTodoBulkOperationRequestSchema = z.infer<typeof TodoBulkOperationRequestSchema>;
export type TTodoChangesSchema = z.infer<typeof TodoChangesSchema>;
