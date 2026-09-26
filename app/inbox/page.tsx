"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  MessageSquare,
  User,
  ArrowLeft,
  RefreshCw,
  Phone,
  Circle,
} from "lucide-react";

interface Message {
  sender: "customer" | "business";
  message: string;
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  phone: string;
  status: string;
  priority: string;
  tags: string[];
  lastMessage?: string;
}

interface Conversation {
  _id: string;
  phone: string;
  leadId?: Lead;
  messages: Message[];
  updatedAt: string;
}

export default function InboxPage() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function fetchConversations(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data: Conversation[] = await response.json();

      setConversations(data);

      if (data.length > 0) {
  setSelected((current) => {
    if (phoneParam) {
      const requestedConversation = data.find(
        (conversation) => conversation.phone === phoneParam
      );

      if (requestedConversation) {
        return requestedConversation;
      }
    }

    if (!current) {
      return data[0];
    }

    const updatedSelected = data.find(
      (conversation) => conversation._id === current._id
    );

    return updatedSelected || data[0];
  });
} else {
  setSelected(null);
}
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchConversations();
  }, [phoneParam]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const lead = conversation.leadId;

      const name = lead?.name?.toLowerCase() || "";
      const phone = conversation.phone?.toLowerCase() || "";

      const messages = conversation.messages
        .map((item) => item.message.toLowerCase())
        .join(" ");

      return (
        name.includes(query) ||
        phone.includes(query) ||
        messages.includes(query)
      );
    });
  }, [conversations, search]);

  async function handleSendMessage() {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || !selected || sending) {
    return;
  }

  try {
    setSending(true);

    const response = await fetch(
      `/api/conversations/${encodeURIComponent(selected.phone)}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to send message"
      );
    }

    setMessage("");

    await fetchConversations(true);
  } catch (error) {
    console.error("Business reply error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to send message."
    );
  } finally {
    setSending(false);
  }
}
async function handleSimulateCustomerMessage() {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || !selected || sending) {
    return;
  }

  const lead = selected.leadId;

  if (!lead) {
    alert("This conversation is not connected to a lead.");
    return;
  }

  try {
    setSending(true);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: lead.name,
        phone: selected.phone,
        message: trimmedMessage,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to simulate customer message"
      );
    }

    setMessage("");

    await fetchConversations(true);
  } catch (error) {
    console.error("Customer simulation error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to simulate customer message."
    );
  } finally {
    setSending(false);
  }
}

  function handleMessageKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex h-[calc(100vh-0px)] flex-col overflow-hidden md:flex-row">
        {/* Conversation List */}
        <aside
          className={`w-full border-r border-slate-200 bg-white md:w-[350px] ${
            selected ? "hidden md:flex" : "flex"
          } flex-col`}
        >
          {/* Inbox Header */}
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Workspace
                </p>

                <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                  Inbox
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Customer conversations
                </p>
              </div>

              <button
                onClick={() => fetchConversations(true)}
                disabled={refreshing}
                title="Refresh conversations"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>

            {/* Search */}
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all duration-200 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100">
              <Search
                size={16}
                className="shrink-0 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Conversation Count */}
          {!loading && (
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-[11px] font-medium text-slate-400">
                {search
                  ? `${filteredConversations.length} result${
                      filteredConversations.length === 1 ? "" : "s"
                    }`
                  : `${conversations.length} conversation${
                      conversations.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse gap-3"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />

                    <div className="flex-1">
                      <div className="h-3 w-28 rounded bg-slate-100" />
                      <div className="mt-2 h-2.5 w-40 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <MessageSquare size={21} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {search
                    ? "No conversations found"
                    : "No conversations"}
                </p>

                <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-400">
                  {search
                    ? "Try searching with another name, phone number or message."
                    : "Incoming customer messages will appear here."}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const lead = conversation.leadId;

                const lastMessage =
                  conversation.messages[
                    conversation.messages.length - 1
                  ];

                const active =
                  selected?._id === conversation._id;

                return (
                  <button
                    key={conversation._id}
                    onClick={() => setSelected(conversation)}
                    className={`group w-full border-b border-slate-100 px-4 py-4 text-left transition-all duration-200 ${
                      active
                        ? "bg-slate-50"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-200 group-hover:scale-105 ${
                          active
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead?.name?.charAt(0).toUpperCase() || "?"}

                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold text-slate-800">
                            {lead?.name || conversation.phone}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-400">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {lastMessage?.message ||
                            "No messages yet"}
                        </p>

                        {lead?.tags?.length ? (
                          <div className="mt-2 flex gap-1.5 overflow-hidden">
                            {lead.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold capitalize text-slate-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat */}
        <section
          className={`flex min-w-0 flex-1 flex-col ${
            selected ? "flex" : "hidden md:flex"
          }`}
        >
          {!selected ? (
            <div className="flex flex-1 items-center justify-center bg-[#f7f8fa]">
              <div className="max-w-sm px-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                  <MessageSquare size={28} />
                </div>

                <h2 className="mt-5 text-sm font-bold text-slate-800">
                  Select a conversation
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Choose a customer from the inbox to view their
                  conversation.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 md:hidden"
                  title="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <User size={17} />

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-slate-900">
                    {selected.leadId?.name || selected.phone}
                  </h2>

                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="text-[11px] text-slate-500">
                      {selected.phone}
                    </p>

                    <span className="text-slate-300">•</span>

                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <Circle
                        size={6}
                        fill="currentColor"
                      />
                      Active
                    </span>
                  </div>
                </div>

                <div className="ml-auto hidden items-center gap-2 sm:flex">
                  {selected.leadId?.priority && (
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-500">
                      {selected.leadId.priority} priority
                    </span>
                  )}

                  <a
                    href={`tel:${selected.phone}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    title="Call customer"
                  >
                    <Phone size={15} />
                  </a>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f8fa] p-5 sm:p-7">
                {selected.messages.map((item, index) => (
                  <div
                    key={`${item.createdAt}-${index}`}
                    className={`flex ${
                      item.sender === "customer"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-md ${
                        item.sender === "customer"
                          ? "rounded-tl-sm border border-slate-100 bg-white text-slate-800"
                          : "rounded-tr-sm bg-slate-900 text-white"
                      }`}
                    >
                      <p className="leading-6">
                        {item.message}
                      </p>

                      <p
                        className={`mt-1.5 text-[9px] ${
                          item.sender === "customer"
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Box */}
              <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                <div
                  className={`flex gap-2 rounded-xl border bg-slate-50 p-2 transition-all duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 ${
                    sending ? "opacity-70" : ""
                  }`}
                >
                  <input
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={handleMessageKeyDown}
                    disabled={sending}
                    placeholder="Type an incoming customer message..."
                    className="flex-1 bg-transparent px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    title="Send message"
                  >
                    {sending ? (
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400">
                    Press Enter to process message
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Automation enabled
                  </p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function formatTime(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}