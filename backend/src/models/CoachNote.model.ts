import mongoose, { Schema } from 'mongoose';
import { ICoachNote } from '../types';

const coachNoteSchema = new Schema<ICoachNote>({
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
  videoId: {
    type: String,
    ref: 'Video'
  },
  note: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['performance', 'technique', 'fitness', 'mental', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

export const CoachNote = mongoose.model<ICoachNote>('CoachNote', coachNoteSchema);
