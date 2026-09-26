"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Zap,
  MessageSquare,
  UserCheck,
  MoreVertical,
  Power,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

interface AutomationRule {
  _id: string;
  name: string;
  triggerValue: string;
  response: string;
  tag?: string;
  status?: string;
  active: boolean;
  createdAt: string;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchRules(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/automation/rules");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch automation rules");
      }

      setRules(data);
      setError("");
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch automation rules"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRules();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <Zap size={20} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Automation
              </h1>

              <p className="text-sm text-slate-500">
                Automate repetitive customer interactions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchRules(true)}
            disabled={refreshing}
            title="Refresh automation rules"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={18} />
            Create Rule
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Overview */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <OverviewCard
          icon={<Zap size={19} />}
          label="Total Rules"
          value={rules.length.toString()}
        />

        <OverviewCard
          icon={<Power size={19} />}
          label="Active Rules"
          value={rules
            .filter((rule) => rule.active)
            .length.toString()}
        />

        <OverviewCard
          icon={<MessageSquare size={19} />}
          label="Automation Status"
          value="Running"
        />
      </div>

      {/* Info */}
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex gap-3">
          <Zap
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h2 className="font-semibold text-blue-900">
              How automation works
            </h2>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              LeadFlow checks incoming customer messages against
              active automation rules. When a rule matches, the
              configured response and lead actions are triggered.
            </p>
          </div>
        </div>
      </div>

      {/* Rules */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border bg-white p-6"
            >
              <div className="h-5 w-48 rounded bg-slate-100" />
              <div className="mt-4 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <Zap
            size={36}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-3 font-semibold text-slate-800">
            No automation rules yet
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your first rule to automate customer messages.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <RuleCard
              key={rule._id}
              rule={rule}
              onDeleted={fetchRules}
            />
          ))}
        </div>
      )}

      {/* Create Rule Modal */}
      {showForm && (
        <CreateRuleModal
          onClose={() => setShowForm(false)}
          onCreated={fetchRules}
        />
      )}
    </main>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function RuleCard({
  rule,
  onDeleted,
}: {
  rule: AutomationRule;
  onDeleted: () => void;
}) {
  const [active, setActive] = useState(rule.active);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function toggleRule() {
    if (updating || deleting) return;

    const newActiveState = !active;
    setUpdating(true);

    try {
      const response = await fetch(
        `/api/automation/rules/${rule._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            active: newActiveState,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update rule.");
      }

      setActive(data.rule?.active ?? newActiveState);
    } catch (error) {
      console.error("Toggle rule error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update rule."
      );
    } finally {
      setUpdating(false);
    }
  }

  async function deleteRule() {
    const confirmed = window.confirm(
      `Delete "${rule.name}" automation rule?`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/automation/rules/${rule._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete rule.");
      }

      onDeleted();
    } catch (error) {
      console.error("Delete rule error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete rule."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Zap size={20} className="text-slate-700" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-900">
                {rule.name}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {active ? "Active" : "Paused"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Trigger and response configured for this rule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleRule}
            disabled={updating || deleting}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "text-amber-600 hover:bg-amber-50"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {updating ? "Saving..." : active ? "Pause" : "Activate"}
          </button>

          <button
            onClick={deleteRule}
            disabled={deleting || updating}
            title="Delete rule"
            className="rounded-lg border p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>

          <button className="rounded-lg border p-2 text-slate-400 hover:bg-slate-50">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Rule Flow */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <RuleStep
          icon={<MessageSquare size={17} />}
          title="WHEN"
          value={`Message contains: ${rule.triggerValue}`}
        />

        <RuleStep
          icon={<UserCheck size={17} />}
          title="THEN"
          value={`Send response${
            rule.tag ? ` + add ${rule.tag} tag` : ""
          }`}
        />
      </div>

      {/* Response */}
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare
            size={15}
            className="text-slate-400"
          />

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Automated Response
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {rule.response}
        </p>
      </div>
    </div>
  );
}

function RuleStep({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <div className="text-slate-400">{icon}</div>

        <span className="text-xs font-semibold tracking-wide text-slate-400">
          {title}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}

function CreateRuleModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [triggerValue, setTriggerValue] = useState("");
  const [response, setResponse] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("interested");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const apiResponse = await fetch(
        "/api/automation/rules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            triggerValue,
            response,
            tag: tag || undefined,
            status,
            active: true,
          }),
        }
      );

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        setError(data.error || "Failed to create rule.");
        return;
      }

      onCreated();
      onClose();
    } catch (error) {
      console.error("Create rule error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Automation Rule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure when and how LeadFlow should respond.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rule Name
            </label>

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pricing Inquiry"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Trigger Keywords
            </label>

            <input
              required
              value={triggerValue}
              onChange={(e) =>
                setTriggerValue(e.target.value)
              }
              placeholder="price, pricing, cost"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate multiple keywords with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Automated Response
            </label>

            <textarea
              required
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write the response that should be sent..."
              className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Lead Tag
            </label>

            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. pricing"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Lead Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}