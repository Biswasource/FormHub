import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema<IOtp> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expire after 5 minutes
});

export const Otp: Model<IOtp> = mongoose.models?.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
