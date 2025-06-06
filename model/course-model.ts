import mongoose,{Schema} from "mongoose";

// Esquema para documentos
const documentSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const courseSchema = new Schema({
    title:{
        required: true,
        type: String
    },
    subtitle:{
        type: String,
        default: "subtitle",
    },
    description:{
        required: true,
        type: String
    },
    thumbnail:{
        type: String
    },
    // Agregar campo para múltiples documentos
    documents: [documentSchema],
    
    modules:[{
        type: Schema.ObjectId, 
        ref: "Module"
    }],
    
    active:{
        required: true,
        default: false,
        type: Boolean
    },
    
    instructor:{
        type: Schema.ObjectId, 
        ref: "User"
    },
    
    testimonials:[{
        type: Schema.ObjectId, 
        ref: "Testimonial"
    }],
    
    // ✅ CORRECCIÓN: Agregar referencia al modelo Quizset
    quizSet:{
        type: Schema.ObjectId,
        ref: "Quizset"  // Agregar referencia explícita
    },
    
    learning:{
        type: [String]
    },
    
    createdOn:{
        required: true,
        default: Date.now,  // Quitar () para que no se ejecute inmediatamente
        type: Date
    },
    
    modifiedOn:{
        required: true,
        default: Date.now,  // Quitar () para que no se ejecute inmediatamente
        type: Date
    },
});

export const Course = mongoose.models.Course ?? mongoose.model("Course", courseSchema);