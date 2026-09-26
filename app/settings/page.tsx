
"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  Inbox,
  Lock,
  Save,
  Settings as SettingsIcon,
  ShieldAlert,
  UserRound,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("LeadFlow");
  const [businessEmail, setBusinessEmail] =
    useState("hello@leadflow.com");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("Software & IT");
  const [timezone, setTimezone] = useState("Asia/Karachi");

  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [autoCreateLeads, setAutoCreateLeads] = useState(true);
  const [autoTagConversations, setAutoTagConversations] =
    useState(true);
  const [autoResponse, setAutoResponse] = useState(true);

  const [showPhoneNumbers, setShowPhoneNumbers] = useState(true);
  const [markAsRead, setMarkAsRead] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [simulationMode, setSimulationMode] = useState(true);

  const [newLeadNotification, setNewLeadNotification] =
    useState(true);
  const [automationNotification, setAutomationNotification] =
    useState(true);
  const [conversationNotification, setConversationNotification] =
    useState(true);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

async function loadSettings() {
  try {
    setLoading(true);

    const response = await fetch("/api/settings");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load settings");
    }

    setBusinessName(data.businessName ?? "LeadFlow");
    setBusinessEmail(data.businessEmail ?? "hello@leadflow.com");
    setPhone(data.phone ?? "");
    setIndustry(data.industry ?? "Software & IT");
    setTimezone(data.timezone ?? "Asia/Karachi");

    setAutomationEnabled(data.automationEnabled ?? true);
    setAutoCreateLeads(data.autoCreateLeads ?? true);
    setAutoTagConversations(data.autoTagConversations ?? true);
    setAutoResponse(data.autoResponse ?? true);

    setShowPhoneNumbers(data.showPhoneNumbers ?? true);
    setMarkAsRead(data.markAsRead ?? true);
    setSaveHistory(data.saveHistory ?? true);
    setSimulationMode(data.simulationMode ?? true);

    setNewLeadNotification(data.newLeadNotification ?? true);
    setAutomationNotification(data.automationNotification ?? true);
    setConversationNotification(data.conversationNotification ?? true);
  } catch (error) {
    console.error("Load settings error:", error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadSettings();
}, []);
  async function handleSave() {
  try {
    setSaving(true);

    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessName,
        businessEmail,
        phone,
        industry,
        timezone,

        automationEnabled,
        autoCreateLeads,
        autoTagConversations,
        autoResponse,

        showPhoneNumbers,
        markAsRead,
        saveHistory,
        simulationMode,

        newLeadNotification,
        automationNotification,
        conversationNotification,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save settings");
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  } catch (error) {
    console.error("Save settings error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to save settings."
    );
  } finally {
    setSaving(false);
  }
}
  function handleDeleteData() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all test data? This action cannot be undone."
    );

    if (!confirmed) return;

    alert(
      "Data deletion is not connected yet. No data has been deleted."
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f8fa]/90 px-5 py-6 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your LeadFlow workspace and preferences.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
          >
            {saved ? <Check size={15} /> : <Save size={15} />}

            <span>{saved ? "Saved" : "Save changes"}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] p-5 sm:p-8">
        <div className="space-y-6">
          {/* Workspace */}
          <SettingsSection
            icon={<Building2 size={17} />}
            title="Workspace"
            description="Manage your business information."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Business name"
                value={businessName}
                onChange={setBusinessName}
                placeholder="Your business name"
              />

              <FormField
                label="Business email"
                type="email"
                value={businessEmail}
                onChange={setBusinessEmail}
                placeholder="hello@example.com"
              />

              <FormField
                label="Phone number"
                value={phone}
                onChange={setPhone}
                placeholder="+92 300 1234567"
              />

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Industry
                </label>

                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option>Software & IT</option>
                  <option>Marketing</option>
                  <option>E-commerce</option>
                  <option>Real Estate</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Timezone
                </label>

                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="Asia/Karachi">
                    Asia/Karachi (Pakistan Standard Time)
                  </option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">
                    Europe/London
                  </option>
                  <option value="America/New_York">
                    America/New_York
                  </option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Automation */}
          <SettingsSection
            icon={<Zap size={17} />}
            title="Automation"
            description="Control how LeadFlow processes incoming messages."
          >
            <div className="divide-y divide-slate-100">
              <ToggleRow
                title="Automation status"
                description="Enable or disable automated workflows."
                enabled={automationEnabled}
                onChange={setAutomationEnabled}
              />

              <ToggleRow
                title="Auto-create leads"
                description="Automatically create or update a lead when a message is processed."
                enabled={autoCreateLeads}
                onChange={setAutoCreateLeads}
              />

              <ToggleRow
                title="Auto-tag conversations"
                description="Apply automation tags based on matched message rules."
                enabled={autoTagConversations}
                onChange={setAutoTagConversations}
              />

              <ToggleRow
                title="Automated responses"
                description="Send predefined responses when an automation rule matches."
                enabled={autoResponse}
                onChange={setAutoResponse}
              />
            </div>
          </SettingsSection>

          {/* Inbox */}
          <SettingsSection
            icon={<Inbox size={17} />}
            title="Inbox"
            description="Configure your conversation experience."
          >
            <div className="divide-y divide-slate-100">
              <ToggleRow
                title="Show customer phone numbers"
                description="Display customer phone numbers inside conversations."
                enabled={showPhoneNumbers}
                onChange={setShowPhoneNumbers}
              />

              <ToggleRow
                title="Mark conversations as read"
                description="Automatically mark opened conversations as read."
                enabled={markAsRead}
                onChange={setMarkAsRead}
              />

              <ToggleRow
                title="Save conversation history"
                description="Keep customer and business messages in the conversation history."
                enabled={saveHistory}
                onChange={setSaveHistory}
              />

              <ToggleRow
                title="Simulation mode"
                description="Use simulated incoming messages for testing automation."
                enabled={simulationMode}
                onChange={setSimulationMode}
              />
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <ShieldAlert size={14} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-900">
                    Simulation mode is enabled
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-blue-700/80">
                    Incoming messages are currently simulated inside
                    LeadFlow. A real WhatsApp Business integration can
                    be connected later.
                  </p>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            icon={<Bell size={17} />}
            title="Notifications"
            description="Choose which workspace events you want to monitor."
          >
            <div className="divide-y divide-slate-100">
              <ToggleRow
                title="New lead received"
                description="Notify when a new lead is created."
                enabled={newLeadNotification}
                onChange={setNewLeadNotification}
              />

              <ToggleRow
                title="Automation triggered"
                description="Notify when an automation rule processes a message."
                enabled={automationNotification}
                onChange={setAutomationNotification}
              />

              <ToggleRow
                title="New conversation"
                description="Notify when a new customer conversation is created."
                enabled={conversationNotification}
                onChange={setConversationNotification}
              />
            </div>
          </SettingsSection>

          {/* Profile */}
          <SettingsSection
            icon={<UserRound size={17} />}
            title="Profile"
            description="Manage your LeadFlow account information."
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                  H
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Muhammad Hanain
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    LeadFlow workspace member
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  alert(
                    "Password management will be connected when authentication settings are implemented."
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <Lock size={14} />
                Change password
                <ChevronRight size={14} />
              </button>
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
            <div className="border-b border-red-100 bg-red-50/50 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <ShieldAlert size={16} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-red-900">
                    Danger Zone
                  </h2>

                  <p className="mt-0.5 text-xs text-red-600/70">
                    Actions in this section can affect your workspace data.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Delete test data
                </p>

                <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-400">
                  Remove test leads and conversations from your
                  workspace. This cannot be undone.
                </p>
              </div>

              <button
                onClick={handleDeleteData}
                className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete test data
              </button>
            </div>
          </section>

          {/* Bottom save */}
          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              {saved ? <Check size={15} /> : <Save size={15} />}

              {saved ? "Changes saved" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${
          enabled ? "bg-slate-900" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

