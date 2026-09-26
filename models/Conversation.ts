import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  sender: "customer" | "business";
  message: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  phone: string;
  leadId?: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["customer", "business"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const conversationSchema = new Schema<IConversation>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;