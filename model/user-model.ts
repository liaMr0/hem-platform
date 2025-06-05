import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  phone?: string;
  bio?: string;
  socialMedia?: Record<string, string>;
  profilePicture?: string;
  designation?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>({
  firstName: {
    required: true,
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    required: true,
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  password: {
    required: true,
    type: String,
    minlength: 8
  },
  email: {
    required: true,
    type: String,
    unique: true, // Esto ya crea un índice único
    lowercase: true,
    trim: true
  },
  role: {
    required: true,
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  status: {
    required: true,
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  phone: {
    required: false,
    type: String,
    trim: true
  },
  bio: {
    required: false,
    type: String,
    default: "",
    maxlength: 500
  },
  socialMedia: {
    required: false,
    type: Map,
    of: String
  },
  profilePicture: {
    required: false,
    type: String,
    default: "/assets/images/avatar.png"
  },
  designation: {
    required: false,
    type: String,
    default: "",
    maxlength: 100
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  approvedAt: {
    type: Date,
    required: false
  },
  lastLogin: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento (sin duplicar el índice de email)
// userSchema.index({ email: 1 }); // REMOVIDO - ya existe por unique: true
userSchema.index({ role: 1, status: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ status: 1 });

// Método virtual para obtener nombre completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Método para verificar si el usuario puede iniciar sesión
userSchema.methods.canLogin = function() {
  return this.status === 'approved';
};

// Método para verificar si el usuario puede gestionar otros usuarios
userSchema.methods.canManageUsers = function() {
  return this.role === 'admin' && this.status === 'approved';
};

// Método para verificar si el usuario puede crear cursos
userSchema.methods.canCreateCourses = function() {
  return (this.role === 'instructor' || this.role === 'admin') && this.status === 'approved';
};

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);