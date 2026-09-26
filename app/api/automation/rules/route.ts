import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AutomationRule from "@/models/AutomationRule";

export async function GET() {
  try {
    await connectDB();

    const rules = await AutomationRule.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("GET /api/automation/rules error:", error);

    return NextResponse.json(
      { error: "Failed to fetch automation rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      triggerValue,
      response,
      tag,
      status,
      active,
    } = body;

    if (!name || !triggerValue || !response) {
      return NextResponse.json(
        {
          error:
            "name, triggerValue and response are required",
        },
        { status: 400 }
      );
    }

    const rule = await AutomationRule.create({
      name,
      triggerType: "contains",
      triggerValue,
      response,
      tag,
      status,
      active: active ?? true,
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("POST /api/automation/rules error:", error);

    return NextResponse.json(
      { error: "Failed to create automation rule" },
      { status: 500 }
    );
  }
}