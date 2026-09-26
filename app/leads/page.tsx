"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  UserRound,
  Phone,
  Mail,
  Building2,
  Tag,
  X,
} from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: string;
  status: string;
  priority: string;
  tags: string[];
  notes?: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(searchText) ||
        lead.phone.toLowerCase().includes(searchText) ||
        lead.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Leads
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your customer leads.
          </p>
        </div>

        <button className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          + Add Lead
        </button>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5">
            <Search size={18} className="text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or email..."
              className="w-full text-sm outline-none"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-3 text-slate-400"
            />

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-3 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <UserRound
              size={36}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-700">
              No leads found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden border-b bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-12 md:gap-4">
              <div className="col-span-3">Lead</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-3">Tags</div>
              <div className="col-span-2">Source</div>
            </div>

            {filteredLeads.map((lead) => (
              <button
                key={lead._id}
                onClick={() => setSelectedLead(lead)}
                className="grid w-full border-b px-6 py-5 text-left transition last:border-0 hover:bg-slate-50 md:grid-cols-12 md:items-center md:gap-4"
              >
                {/* Lead */}
                <div className="col-span-3 flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {lead.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {lead.phone}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 mt-3 md:mt-0">
                  <StatusBadge status={lead.status} />
                </div>

                {/* Priority */}
                <div className="col-span-2 mt-3 md:mt-0">
                  <PriorityBadge priority={lead.priority} />
                </div>

                {/* Tags */}
                <div className="col-span-3 mt-3 flex flex-wrap gap-1 md:mt-0">
                  {lead.tags?.length ? (
                    lead.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No tags
                    </span>
                  )}
                </div>

                {/* Source */}
                <div className="col-span-2 mt-3 text-xs text-slate-500 md:mt-0">
                  {lead.source}
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedLead(null)}
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Lead Details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedLead.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedLead.status} />
                <PriorityBadge priority={selectedLead.priority} />
              </div>

              {/* Contact */}
              <section>
                <h3 className="mb-3 text-sm font-semibold">
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <InfoRow
                    icon={<Phone size={16} />}
                    label="Phone"
                    value={selectedLead.phone}
                  />

                  {selectedLead.email && (
                    <InfoRow
                      icon={<Mail size={16} />}
                      label="Email"
                      value={selectedLead.email}
                    />
                  )}

                  {selectedLead.company && (
                    <InfoRow
                      icon={<Building2 size={16} />}
                      label="Company"
                      value={selectedLead.company}
                    />
                  )}
                </div>
              </section>

              {/* Tags */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-slate-400" />
                  <h3 className="text-sm font-semibold">Tags</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags?.length ? (
                    selectedLead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">
                      No tags
                    </span>
                  )}
                </div>
              </section>

              {/* Last Message */}
              <section>
                <h3 className="mb-3 text-sm font-semibold">
                  Last Message
                </h3>

                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedLead.lastMessage ||
                    "No message available."}
                </div>
              </section>

              {/* Notes */}
              <section>
                <h3 className="mb-3 text-sm font-semibold">
                  Notes
                </h3>

                <div className="rounded-xl border p-4 text-sm text-slate-500">
                  {selectedLead.notes || "No notes added yet."}
                </div>
              </section>

              {/* Metadata */}
              <section className="border-t pt-5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Source</span>
                  <span>{selectedLead.source}</span>
                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Created</span>
                  <span>
                    {new Date(
                      selectedLead.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    interested: "bg-purple-100 text-purple-700",
    converted: "bg-emerald-100 text-emerald-700",
    lost: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "text-slate-500",
    medium: "text-amber-600",
    high: "text-red-600",
  };

  return (
    <span
      className={`text-xs font-medium capitalize ${
        styles[priority] || "text-slate-500"
      }`}
    >
      {priority} priority
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>

      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}