import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET() {
  try {
    await connectDB();

    const conversations = await Conversation.find()
      .populate("leadId")
      .sort({ updatedAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET /api/conversations error:", error);

    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}