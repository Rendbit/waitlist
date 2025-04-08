import { Document } from "mongoose";

/**
 * IUser Interface
 * Describes the structure of the User object.
 */
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  stellarPublicKey: string;
  createdAt?: Date;
}
