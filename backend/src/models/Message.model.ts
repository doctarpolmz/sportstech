import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
  senderId: {
    type: String,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: String,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'video'],
    default: 'text'
  },
  fileUrl: String,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
