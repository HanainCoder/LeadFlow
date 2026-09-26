import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: string;
  status: "new" | "contacted" | "interested" | "converted" | "lost";
  priority: "low" | "medium" | "high";
  tags: string[];
  notes?: string;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      default: "WhatsApp",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "interested", "converted", "lost"],
      default: "new",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    tags: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
    },

    lastMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Lead: Model<ILead> =
  mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", leadSchema);

export default Lead;