"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Send,
  MessageSquare,
  User,
  ArrowLeft,
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);

        if (data.length > 0) {
          setSelected(data[0]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch conversations:", error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex h-screen flex-col md:flex-row">

        {/* Conversation List */}
        <aside
          className={`w-full border-r bg-white md:w-80 ${
            selected ? "hidden md:flex" : "flex"
          } flex-col`}
        >
          <div className="border-b p-5">
            <h1 className="text-xl font-bold text-slate-900">
              Inbox
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Customer conversations
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Search size={16} className="text-slate-400" />

              <input
                placeholder="Search conversations..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-5 text-sm text-slate-500">
                Loading conversations...
              </p>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium">
                  No conversations
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Incoming customer messages will appear here.
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const lead = conversation.leadId;
                const lastMessage =
                  conversation.messages[
                    conversation.messages.length - 1
                  ];

                return (
                  <button
                    key={conversation._id}
                    onClick={() => setSelected(conversation)}
                    className={`w-full border-b p-4 text-left transition hover:bg-slate-50 ${
                      selected?._id === conversation._id
                        ? "bg-slate-50"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {lead?.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {lead?.name || conversation.phone}
                          </p>

                          <span className="text-[10px] text-slate-400">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {lastMessage?.message}
                        </p>
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
          className={`flex flex-1 flex-col ${
            selected ? "flex" : "hidden md:flex"
          }`}
        >
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquare
                  size={45}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 font-semibold">
                  Select a conversation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a customer from the inbox.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <header className="flex items-center gap-3 border-b bg-white px-5 py-4">
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    {selected.leadId?.name || selected.phone}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selected.phone}
                  </p>
                </div>

                <div className="ml-auto">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                {selected.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "customer"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                        message.sender === "customer"
                          ? "rounded-tl-sm bg-white text-slate-800 shadow-sm"
                          : "rounded-tr-sm bg-slate-900 text-white"
                      }`}
                    >
                      <p>{message.message}</p>

                      <p
                        className={`mt-1 text-[10px] ${
                          message.sender === "customer"
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Box */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-3 rounded-xl border p-2">
                  <input
                    placeholder="Type a message..."
                    className="flex-1 px-3 text-sm outline-none"
                  />

                  <button className="rounded-lg bg-slate-900 p-3 text-white">
                    <Send size={17} />
                  </button>
                </div>

                <p className="mt-2 px-1 text-[11px] text-slate-400">
                  LeadFlow Inbox • Automated responses are managed by
                  your automation rules.
                </p>
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