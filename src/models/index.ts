import mongoose, { Schema } from "mongoose";

const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const priorityRegex = /^[A-Z][1-9][0-9]?$|^A99$/;

const LabelSchema = new Schema({
    name: { type: String, required: [true, "Name is required"], unique: true },
    color: { type: String, required: false, default: "#000000", unique: true },
});

LabelSchema.path("color").validate((val) => {
    return colorRegex.test(val);
}, "Color must be a valid hexadecimal value");

LabelSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
LabelSchema.set("toJSON", {
    virtuals: true,
});

const TodoSchema = new Schema(
    {
        title: { type: String, required: [true, "Title is required"] },
        description: { type: String, required: false, default: "" },
        deadline: { type: Number, required: false, default: null },
        reminder: { type: Number, required: false, default: null },
        completedOn: { type: Number, required: false, default: null },
        deletedOn: { type: Number, required: false, default: null },
        isPinned: { type: Boolean, required: false, default: false },
        isDeleted: { type: Boolean, required: false, default: false },
        isDone: { type: Boolean, required: false, default: false },
        priority: { type: String, required: false, default: "A1" },
        color: { type: String, required: false, default: "#FFFFFF" },
        labels: [LabelSchema],
    },
    { timestamps: true },
);

// Custom validation
TodoSchema.path("priority").validate((val) => {
    return priorityRegex.test(val);
}, "Priority is not a valid format");

TodoSchema.path("color").validate((val) => {
    return colorRegex.test(val);
}, "Color must be a valid hexadecimal value");

// Add virtual fields
TodoSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

TodoSchema.virtual("createdOn").get(function () {
    return new Date(this.createdAt).getTime() / 1000;
});
TodoSchema.virtual("updatedOn").get(function () {
    return new Date(this.updatedAt).getTime() / 1000;
});

// Ensure virtual fields are serialised.
TodoSchema.set("toJSON", {
    virtuals: true,
});

export const TodoModel = mongoose.model("TodoModel", TodoSchema);
export const LabelModel = mongoose.model("LabelModel", LabelSchema);
