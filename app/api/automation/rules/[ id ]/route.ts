import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AutomationRule from "@/models/AutomationRule";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    console.log("PATCH rule ID:", id);
    console.log("PATCH body:", body);

    const rule = await AutomationRule.findOne({
      _id: id,
    });

    if (!rule) {
      console.log("Rule not found:", id);

      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    if (typeof body.active === "boolean") {
      rule.active = body.active;
    }

    await rule.save();

    console.log("Rule updated:", rule);

    return NextResponse.json({
      success: true,
      rule,
    });
  } catch (error) {
    console.error("PATCH rule error:", error);

    return NextResponse.json(
      {
        error: "Failed to update automation rule",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const rule = await AutomationRule.findOne({
      _id: id,
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    await rule.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Automation rule deleted",
    });
  } catch (error) {
    console.error("DELETE rule error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete automation rule",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}