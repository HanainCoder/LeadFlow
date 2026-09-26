import AutomationRule from "@/models/AutomationRule";

export async function processMessage(message: string) {
  const text = message.toLowerCase();

  const rules = await AutomationRule.find({
    active: true,
  }).sort({ createdAt: 1 });

  for (const rule of rules) {
    const keywords = rule.triggerValue
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);

    const matched = keywords.some((keyword) =>
      text.includes(keyword)
    );

    if (matched) {
      return {
        intent: rule.name.toLowerCase().replace(/\s+/g, "_"),
        tag: rule.tag || "general",
        response: rule.response,
        status: rule.status,
        ruleId: rule._id,
      };
    }
  }

  return {
    intent: "general",
    tag: "general",
    response:
      "Thanks for contacting us! We've received your message and will get back to you shortly.",
    status: "new",
    ruleId: null,
  };
}