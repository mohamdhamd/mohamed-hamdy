// نموذج بيانات المشروع في MongoDB
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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
    summary_ar: {
      type: String,
      required: true,
    },
    summary_en: {
      type: String,
      required: true,
    },
    body_ar: {
      type: String,
      default: '',
    },
    body_en: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    tech: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['fullstack', 'data_analysis', 'accounting', 'web', 'tools', 'systems'],
      default: 'fullstack',
    },
    category_label_ar: {
      type: String,
      default: 'تطبيقات ويب',
    },
    category_label_en: {
      type: String,
      default: 'Web Apps',
    },
    live_url: {
      type: String,
      default: null,
    },
    repo_url: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    code_snippet: {
      type: String,
      default: '',
    },
    fullstack_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    analytics_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    accounting_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
