import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkspaceSettings extends Document {
  businessName: string;
  businessEmail: string;
  phone: string;
  industry: string;
  timezone: string;

  automationEnabled: boolean;
  autoCreateLeads: boolean;
  autoTagConversations: boolean;
  autoResponse: boolean;

  showPhoneNumbers: boolean;
  markAsRead: boolean;
  saveHistory: boolean;
  simulationMode: boolean;

  newLeadNotification: boolean;
  automationNotification: boolean;
  conversationNotification: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const workspaceSettingsSchema = new Schema<IWorkspaceSettings>(
  {
    businessName: {
      type: String,
      default: "LeadFlow",
      trim: true,
    },

    businessEmail: {
      type: String,
      default: "hello@leadflow.com",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "Software & IT",
      trim: true,
    },

    timezone: {
      type: String,
      default: "Asia/Karachi",
      trim: true,
    },

    automationEnabled: {
      type: Boolean,
      default: true,
    },

    autoCreateLeads: {
      type: Boolean,
      default: true,
    },

    autoTagConversations: {
      type: Boolean,
      default: true,
    },

    autoResponse: {
      type: Boolean,
      default: true,
    },

    showPhoneNumbers: {
      type: Boolean,
      default: true,
    },

    markAsRead: {
      type: Boolean,
      default: true,
    },

    saveHistory: {
      type: Boolean,
      default: true,
    },

    simulationMode: {
      type: Boolean,
      default: true,
    },

    newLeadNotification: {
      type: Boolean,
      default: true,
    },

    automationNotification: {
      type: Boolean,
      default: true,
    },

    conversationNotification: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkspaceSettings: Model<IWorkspaceSettings> =
  mongoose.models.WorkspaceSettings ||
  mongoose.model<IWorkspaceSettings>(
    "WorkspaceSettings",
    workspaceSettingsSchema
  );

export default WorkspaceSettings;