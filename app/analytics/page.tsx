
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  priority: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const statusOrder = [
  "new",
  "contacted",
  "interested",
  "converted",
  "lost",
];

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchLeads(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data: Lead[] = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const analytics = useMemo(() => {
    const total = leads.length;

    const newLeads = leads.filter(
      (lead) => lead.status === "new"
    ).length;

    const contacted = leads.filter(
      (lead) => lead.status === "contacted"
    ).length;

    const interested = leads.filter(
      (lead) => lead.status === "interested"
    ).length;

    const converted = leads.filter(
      (lead) => lead.status === "converted"
    ).length;

    const lost = leads.filter(
      (lead) => lead.status === "lost"
    ).length;

    const conversionRate =
      total > 0 ? Math.round((converted / total) * 100) : 0;

    const highPriority = leads.filter(
      (lead) => lead.priority === "high"
    ).length;

    const mediumPriority = leads.filter(
      (lead) => lead.priority === "medium"
    ).length;

    const lowPriority = leads.filter(
      (lead) => lead.priority === "low"
    ).length;

    const tagCounts: Record<string, number> = {};

    leads.forEach((lead) => {
      lead.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const sourceCounts: Record<string, number> = {};

    leads.forEach((lead) => {
      const source = lead.source || "Unknown";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const sources = Object.entries(sourceCounts).sort(
      (a, b) => b[1] - a[1]
    );

    return {
      total,
      newLeads,
      contacted,
      interested,
      converted,
      lost,
      conversionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      topTags,
      sources,
    };
  }, [leads]);

  const statusData = [
    { label: "New", value: analytics.newLeads, key: "new" },
    {
      label: "Contacted",
      value: analytics.contacted,
      key: "contacted",
    },
    {
      label: "Interested",
      value: analytics.interested,
      key: "interested",
    },
    {
      label: "Converted",
      value: analytics.converted,
      key: "converted",
    },
    { label: "Lost", value: analytics.lost, key: "lost" },
  ];

  const maxStatusValue = Math.max(
    ...statusData.map((item) => item.value),
    1
  );

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-[#f7f8fa]/90 px-5 py-6 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor lead performance and automation activity.
            </p>
          </div>

          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
        {/* Overview */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total leads"
            value={analytics.total}
            description="All captured leads"
            icon={<Users size={18} />}
          />

          <MetricCard
            title="Interested"
            value={analytics.interested}
            description="Potential customers"
            icon={<Zap size={18} />}
          />

          <MetricCard
            title="Converted"
            value={analytics.converted}
            description="Successful conversions"
            icon={<CheckCircle2 size={18} />}
          />

          <MetricCard
            title="Conversion rate"
            value={`${analytics.conversionRate}%`}
            description="Converted / total leads"
            icon={<TrendingUp size={18} />}
          />
        </section>

        {/* Main analytics */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          {/* Status chart */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Lead pipeline
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Distribution of leads across each stage.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <BarChart3 size={16} />
              </div>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : analytics.total === 0 ? (
              <EmptyAnalytics text="No lead data available yet." />
            ) : (
              <div className="mt-8 space-y-5">
                {statusData.map((item) => {
                  const percentage =
                    analytics.total > 0
                      ? Math.round(
                          (item.value / analytics.total) * 100
                        )
                      : 0;

                  const width =
                    (item.value / maxStatusValue) * 100;

                  return (
                    <div key={item.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${getStatusDot(
                              item.key
                            )}`}
                          />

                          <span className="text-xs font-semibold text-slate-700">
                            {item.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {item.value}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getStatusBar(
                            item.key
                          )}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Priority */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Lead priority
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current priority distribution.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Activity size={16} />
              </div>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : (
              <div className="mt-8 space-y-6">
                <PriorityRow
                  label="High priority"
                  value={analytics.highPriority}
                  total={analytics.total}
                  dot="bg-red-500"
                />

                <PriorityRow
                  label="Medium priority"
                  value={analytics.mediumPriority}
                  total={analytics.total}
                  dot="bg-amber-500"
                />

                <PriorityRow
                  label="Low priority"
                  value={analytics.lowPriority}
                  total={analytics.total}
                  dot="bg-slate-400"
                />
              </div>
            )}
          </section>
        </div>

        {/* Tags + Sources */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Tags */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Top lead tags
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Most frequently applied automation tags.
              </p>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : analytics.topTags.length === 0 ? (
              <EmptyAnalytics text="No tags available yet." />
            ) : (
              <div className="mt-6 space-y-4">
                {analytics.topTags.map(([tag, count]) => {
                  const maxTagCount =
                    analytics.topTags[0]?.[1] || 1;

                  const width =
                    (count / maxTagCount) * 100;

                  return (
                    <div key={tag}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-600">
                          {tag}
                        </span>

                        <span className="text-xs font-semibold text-slate-600">
                          {count}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-800 transition-all duration-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sources */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lead sources
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Where your captured leads are coming from.
              </p>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : analytics.sources.length === 0 ? (
              <EmptyAnalytics text="No source data available yet." />
            ) : (
              <div className="mt-6 space-y-3">
                {analytics.sources.map(([source, count]) => {
                  const percentage =
                    analytics.total > 0
                      ? Math.round(
                          (count / analytics.total) * 100
                        )
                      : 0;

                  return (
                    <div
                      key={source}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                          <Users size={14} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {source}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {percentage}% of leads
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Recent activity */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent lead activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest leads entering your workspace.
              </p>
            </div>

            <Clock3 size={16} className="text-slate-400" />
          </div>

          {loading ? (
            <div className="p-6">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : recentLeads.length === 0 ? (
            <EmptyAnalytics text="No recent lead activity." />
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {lead.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {lead.source} ·{" "}
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-500">
                      {lead.priority}
                    </span>

                    <StatusBadge status={lead.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
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

function PriorityRow({
  label,
  value,
  total,
  dot,
}: {
  label: string;
  value: number;
  total: number;
  dot: string;
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="text-xs font-semibold text-slate-700">
            {label}
          </span>
        </div>

        <span className="text-xs font-bold text-slate-700">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${dot}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-50 text-blue-600 border-blue-100",
    contacted: "bg-amber-50 text-amber-600 border-amber-100",
    interested: "bg-purple-50 text-purple-600 border-purple-100",
    converted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    lost: "bg-red-50 text-red-500 border-red-100",
  };

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold capitalize ${
        styles[status] || "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function getStatusDot(status: string) {
  const styles: Record<string, string> = {
    new: "bg-blue-500",
    contacted: "bg-amber-500",
    interested: "bg-purple-500",
    converted: "bg-emerald-500",
    lost: "bg-red-500",
  };

  return styles[status] || "bg-slate-400";
}

function getStatusBar(status: string) {
  const styles: Record<string, string> = {
    new: "bg-blue-500",
    contacted: "bg-amber-500",
    interested: "bg-purple-500",
    converted: "bg-emerald-500",
    lost: "bg-red-500",
  };

  return styles[status] || "bg-slate-400";
}

function ChartSkeleton() {
  return (
    <div className="mt-8 space-y-5">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse">
          <div className="mb-2 h-3 w-24 rounded bg-slate-100" />
          <div className="h-2 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyAnalytics({ text }: { text: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center text-center">
      <div>
        <BarChart3
          size={28}
          className="mx-auto text-slate-300"
        />
        <p className="mt-3 text-xs text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

