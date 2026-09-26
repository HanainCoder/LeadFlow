import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

type RouteContext = {
  params: Promise<{ phone: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { phone } = await context.params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const decodedPhone = decodeURIComponent(phone);

    const conversation = await Conversation.findOne({
      phone: decodedPhone,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    conversation.messages.push({
      sender: "business",
      message: message.trim(),
      createdAt: new Date(),
    });

    await conversation.save();

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Business reply error:", error);

    return NextResponse.json(
      { error: "Failed to send business message" },
      { status: 500 }
    );
  }
}