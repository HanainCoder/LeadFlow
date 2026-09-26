"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Zap,
  BarChart3,
  Settings,
  Menu,
  X,
  Bot,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: MessageSquare,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    name: "Automation",
    href: "/automation",
    icon: Zap,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile Topbar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Bot size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">LeadFlow</p>
            <p className="text-[10px] text-slate-400">Lead Automation</p>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111827] text-white transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg">
              <Bot size={21} />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight">LeadFlow</p>
              <p className="text-[11px] text-slate-400">
                Lead Automation
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? "text-slate-900" : "text-slate-500"
                    }`}
                  />

                  <span className="flex-1">{item.name}</span>

                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="text-slate-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Automation Status */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-semibold text-slate-200">
                Automation Active
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Your active rules are monitoring incoming customer messages.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              pathname.startsWith("/settings")
                ? "bg-white text-slate-900"
                : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            <Settings
              size={18}
              className={`${
                pathname.startsWith("/settings")
                  ? "text-slate-900"
                  : "text-slate-500"
              }`}
            />

            <span className="flex-1">Settings</span>

            <ChevronRight size={15} className="text-slate-500" />
          </Link>

          <div className="mt-4 px-3">
            <p className="text-[10px] text-slate-600">
              LeadFlow MVP
            </p>
            <p className="mt-1 text-[10px] text-slate-700">
              Lead automation platform
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen md:pl-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}