import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', trim: true, maxlength: 2000 },
  dueAt: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
}, { timestamps: true, versionKey: false });

taskSchema.index({ dueAt: 1, _id: 1 });
taskSchema.index({ status: 1, dueAt: 1 });
export const Task = mongoose.model('Task', taskSchema);
