import mongoose, { Schema } from "mongoose";

const quizsetSchema = new Schema({
    title: {
        required: true,
        type: String,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    quizIds: [{
        type: Schema.ObjectId,
        ref: "Quiz"
    }],
    active: {
        required: true,
        default: false,
        type: Boolean
    },
    // Agregar campo instructor para asociar el cuestionario con un instructor
    instructor: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdOn: {
        required: true,
        default: Date.now,
        type: Date
    },
    modifiedOn: {
        required: true,
        default: Date.now,
        type: Date
    }
});

// Índice para mejorar las consultas por instructor
quizsetSchema.index({ instructor: 1 });
quizsetSchema.index({ active: 1, instructor: 1 });

export const Quizset = mongoose.models.Quizset ?? mongoose.model("Quizset", quizsetSchema);