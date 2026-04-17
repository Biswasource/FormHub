import mongoose, { Schema, model, models } from 'mongoose';

const SubmissionSchema = new Schema({
  formId: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: true }, // Store dynamic form responses mapped to Field IDs
  submittedAt: { type: Date, default: Date.now }
});

delete mongoose.models.Submission;
export const Submission = models.Submission || model('Submission', SubmissionSchema);
