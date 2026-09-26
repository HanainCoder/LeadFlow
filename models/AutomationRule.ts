import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAutomationRule extends Document {
  name: string;
  triggerType: "contains";
  triggerValue: string;
  response: string;
  tag?: string;
  status?: "new" | "contacted" | "interested" | "converted" | "lost";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const automationRuleSchema = new Schema<IAutomationRule>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    triggerType: {
      type: String,
      enum: ["contains"],
      default: "contains",
    },

    triggerValue: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "interested",
        "converted",
        "lost",
      ],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AutomationRule: Model<IAutomationRule> =
  mongoose.models.AutomationRule ||
  mongoose.model<IAutomationRule>(
    "AutomationRule",
    automationRuleSchema
  );

export default AutomationRule;