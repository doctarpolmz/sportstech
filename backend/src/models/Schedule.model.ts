import mongoose, { Schema } from 'mongoose';
import { ISchedule } from '../types';

const scheduleSchema = new Schema<ISchedule>({
  coachId: {
    type: String,
    ref: 'User',
    required: true
  },
  athleteId: {
    type: String,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['training', 'match', 'meeting'],
    default: 'training'
  },
  googleCalendarEventId: String
}, {
  timestamps: true
});

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
