// model/enrollment-model.ts
import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema({ 
    enrollment_date: {
        required: true,
        type: Date,
        default: Date.now
    },    
    status: {
        required: true,
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'paused'],
        default: 'not-started'
    },
    completion_date: {
        required: false,
        type: Date
    },
    course: {  
        type: Schema.ObjectId, 
        ref: "Course",
        required: true
    },
    student: {  
        type: Schema.ObjectId, 
        ref: "User",
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    last_accessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Índice compuesto único para evitar enrollments duplicados
enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

// Índices adicionales para optimizar queries
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });

// Middleware para manejar errores de duplicado
enrollmentSchema.post('save', function(error: any, doc: any, next: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('User is already enrolled in this course'));
    } else {
        next(error);
    }
});

export const Enrollment = mongoose.models.Enrollment ?? mongoose.model("Enrollment", enrollmentSchema);