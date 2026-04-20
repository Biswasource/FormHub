import mongoose, { Schema, model, models } from 'mongoose';

const FieldSchema = new Schema({
  id: String,
  type: { type: String, required: true },
  label: String,
  description: String,
  placeholder: String,
  required: Boolean,
  // email specific
  autoDomain: String,
  allowedDomains: String,
  rejectedDomains: String,
  onlyBusinessDomains: Boolean,
  customErrorMsg: String,
  // other validation
  minChars: String,
  maxChars: String,
  regexPattern: String,
  prePopulate: Boolean,
  // option selection specific
  options: [String],
  sliderMin: { type: Number, default: 0 },
  sliderMax: { type: Number, default: 100 },
  stepId: { type: String, default: 'default' }
});

const StepSchema = new Schema({
  id: String,
  label: String
});

const FormSchema = new Schema({
  userId: { type: String }, // Enables isolated multi-tenant mapping
  title: { type: String, default: 'Untitled Form' },
  description: String,
  formType: { type: String, default: 'single', enum: ['single', 'multi'] },
  steps: [StepSchema],
  theme: { type: String, default: 'dark', enum: ['dark', 'light'] },
  fields: [FieldSchema],
  createdAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
  isHeadless: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  submissionsCount: { type: Number, default: 0 }
});

delete mongoose.models.Form;
export const Form = models.Form || model('Form', FormSchema);
