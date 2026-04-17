import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  forwardingEmail?: string;
  isSetupComplete: boolean;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  forwardingEmail: { type: String },
  isSetupComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Vital for Next.js hot-reloading schemas
delete mongoose.models.User;
export const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
