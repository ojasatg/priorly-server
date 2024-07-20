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
