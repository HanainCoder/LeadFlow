import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkspaceSettings from "@/models/WorkspaceSettings";

export async function GET() {
  try {
    await connectDB();

    let settings = await WorkspaceSettings.findOne();

    if (!settings) {
      settings = await WorkspaceSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const allowedFields = [
      "businessName",
      "businessEmail",
      "phone",
      "industry",
      "timezone",

      "automationEnabled",
      "autoCreateLeads",
      "autoTagConversations",
      "autoResponse",

      "showPhoneNumbers",
      "markAsRead",
      "saveHistory",
      "simulationMode",

      "newLeadNotification",
      "automationNotification",
      "conversationNotification",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    const settings = await WorkspaceSettings.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}