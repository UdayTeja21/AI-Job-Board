import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['interview_scheduled', 'application_update', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      applicationId: { type: mongoose.Schema.ObjectId, ref: 'Application' },
      jobId: { type: mongoose.Schema.ObjectId, ref: 'Job' },
      availableSlots: { type: String },
      meetingLink: { type: String },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
