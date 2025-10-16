import mongoose, { Schema } from 'mongoose';
import { ILineup } from '../types';

const lineupSchema = new Schema<ILineup>({
  coachId: {
    type: String,
    ref: 'User',
    required: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: String,
    required: true
  },
  formation: {
    type: String,
    required: true
  },
  players: [{
    playerId: {
      type: String,
      ref: 'User'
    },
    playerName: String,
    position: String,
    photo: String,
    x: Number,
    y: Number
  }]
}, {
  timestamps: true
});

export const Lineup = mongoose.model<ILineup>('Lineup', lineupSchema);
