// نموذج بيانات الشهادات والمسار المهني في MongoDB
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title_ar: {
      type: String,
      required: true,
      trim: true,
    },
    title_en: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issuer_en: {
      type: String,
      required: true,
    },
    issue_date: {
      type: String,
      required: true,
    },
    issue_date_en: {
      type: String,
      required: true,
    },
    credential_url: {
      type: String,
      default: null,
    },
    status_ar: {
      type: String,
      default: 'معتمد وموثق',
    },
    status_en: {
      type: String,
      default: 'Verified',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
