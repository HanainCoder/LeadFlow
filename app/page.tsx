"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  Zap,
  Bell,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  priority: string;
  tags: string[];
  lastMessage?: string;
  createdAt?: string;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch leads:", error);
        setLoading(false);
      });
  }, []);

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "new"
  ).length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "interested"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-slate-200/80 bg-[#f7f8fa]/90 px-5 backdrop-blur-xl sm:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow md:flex">
            <span className="sr-only">Search</span>

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow">
            <Bell size={17} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
          </button>

          <button className="group flex h-10 items-center gap-2 rounded-xl bg-[#111827] px-3.5 text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg sm:px-4">
            <Plus
              size={16}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
        {/* Hero */}
        <section className="mb-8 animate-[fadeIn_.45s_ease-out]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
                <Sparkles size={13} />
                Lead automation workspace
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Welcome back.
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Monitor incoming leads, conversations and automated
                workflows from one place.
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                System status
              </p>

              <div className="mt-1 flex items-center justify-end gap-2 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All systems operational
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total leads"
            value={totalLeads}
            icon={<Users size={18} />}
            description="All captured leads"
            delay="0ms"
          />

          <StatCard
            title="New leads"
            value={newLeads}
            icon={<Clock3 size={18} />}
            description="Awaiting follow-up"
            delay="60ms"
          />

          <StatCard
            title="Interested"
            value={interestedLeads}
            icon={<Zap size={18} />}
            description="Potential customers"
            delay="120ms"
          />

          <StatCard
            title="Converted"
            value={convertedLeads}
            icon={<CheckCircle2 size={18} />}
            description="Successful conversions"
            delay="180ms"
          />
        </section>

        {/* Content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          {/* Recent Leads */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent leads
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Latest customer inquiries
                </p>
              </div>

              <Link
                href="/leads"
                className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                View all

                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-100" />

                    <div className="flex-1">
                      <div className="h-3 w-32 rounded bg-slate-100" />
                      <div className="mt-2 h-2.5 w-48 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leads.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Users size={20} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  No leads yet
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                  Incoming customer inquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {leads.slice(0, 5).map((lead) => (
                  <div
                    key={lead._id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-slate-50/70 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 transition-transform duration-200 group-hover:scale-105">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-slate-800">
                          {lead.name}
                        </p>

                        <p className="mt-0.5 max-w-[360px] truncate text-xs text-slate-400">
                          {lead.lastMessage || lead.phone}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-500">
                        {lead.tags?.[0] || "General"}
                      </span>

                      <StatusBadge status={lead.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Automation Activity */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automation activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Recent automated actions
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Activity size={15} />
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-1">
                <ActivityItem
                  title="Pricing inquiry detected"
                  description="Pricing tag added automatically"
                  time="Just now"
                />

                <ActivityItem
                  title="New lead created"
                  description="Lead saved to CRM"
                  time="5 min ago"
                />

                <ActivityItem
                  title="Response triggered"
                  description="Predefined response sent"
                  time="12 min ago"
                />

                <ActivityItem
                  title="Website inquiry detected"
                  description="Web Development tag applied"
                  time="28 min ago"
                />
              </div>

              <Link
                href="/automation"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
              >
                Manage automations
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  delay: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className="group animate-[slideUp_.45s_ease-out_both] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-slate-100 text-slate-600 border-slate-200",
    contacted: "bg-blue-50 text-blue-600 border-blue-100",
    interested: "bg-amber-50 text-amber-600 border-amber-100",
    converted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    lost: "bg-red-50 text-red-500 border-red-100",
  };

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold capitalize ${
        styles[status] || styles.new
      }`}
    >
      {status}
    </span>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="group flex gap-3 rounded-xl p-2.5 transition-colors duration-200 hover:bg-slate-50">
      <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-slate-900 group-hover:text-white">
        <Zap size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[12px] font-semibold text-slate-800">
            {title}
          </p>

          <span className="shrink-0 text-[10px] text-slate-400">
            {time}
          </span>
        </div>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}