
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Conversation from "@/models/Conversation";
import { processMessage } from "@/lib/automation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "name, phone and message are required" },
        { status: 400 }
      );
    }

    const automation = await processMessage(message);

    

const lead = await Lead.findOneAndUpdate(
  { phone },
  {
    $set: {
      name,
      lastMessage: message,
      status: automation.status,
    },
    $addToSet: {
      tags: automation.tag,
    },
  },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }
);

    const conversation = await Conversation.findOneAndUpdate(
      { phone },
      {
        $set: {
          leadId: lead._id,
        },
        $push: {
          messages: [
            {
              sender: "customer",
              message,
            },
            {
              sender: "business",
              message: automation.response,
            },
          ],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      lead,
      conversation,
      automation: {
        intent: automation.intent,
        response: automation.response,
      },
    });
  } catch (error) {
    console.error("POST /api/messages error:", error);

    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}