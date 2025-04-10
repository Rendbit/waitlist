import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

/**
 * User Schema Definition
 * This schema defines how user data will be stored in the MongoDB database.
 */
const userSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true, // Removes leading/trailing whitespace
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensures email is unique across users
      lowercase: true, // Stores email in lowercase
      trim: true,
      index: true, // Adds index for faster query performance
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Compound Index
 * Enforces a unique constraint across both email and stellarPublicKey.
 * This ensures that the same combination cannot be registered twice.
 */
userSchema.index({ email: 1}, { unique: true });

/**
 * Mongoose Model
 * Compiles the schema into a model to interact with the users collection.
 */
const User = mongoose.model<IUser>('User', userSchema);

// Exporting the model for use in other parts of the application
export default User;
