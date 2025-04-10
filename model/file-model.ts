
import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  fileName: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Comprueba si el modelo ya existe para evitar errores en desarrollo con hot-reload
export default mongoose.models.File || mongoose.model<IFile>('File', FileSchema);