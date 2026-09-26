import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Conversation from "@/models/Conversation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required" },
        { status: 400 }
      );
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    let conversation = await Conversation.findOne({
      phone: lead.phone,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        phone: lead.phone,
        leadId: lead._id,
        messages: [],
      });
    } else if (!conversation.leadId) {
      conversation.leadId = lead._id;
      await conversation.save();
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation._id,
      phone: conversation.phone,
    });
  } catch (error) {
    console.error("Start conversation error:", error);

    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}