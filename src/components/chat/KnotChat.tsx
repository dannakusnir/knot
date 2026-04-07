"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

interface Message {
  id: string;
  knot_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

interface KnotChatProps {
  knotId: string;
  currentUserId: string;
  otherName: string;
}

function timeLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function KnotChat({
  knotId,
  currentUserId,
  otherName,
}: KnotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load messages
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("knot_id", knotId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    }
    load();
  }, [knotId, supabase]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${knotId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `knot_id=eq.${knotId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [knotId, supabase]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    await supabase.from("messages").insert({
      knot_id: knotId,
      sender_id: currentUserId,
      body: text,
    });

    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white overflow-hidden" style={{ height: "400px" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#EDE8E2]">
        <p className="text-sm font-semibold text-[#3D3229]">
          Chat with {otherName}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[#C4BBB2] py-8">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMine
                    ? "bg-[#6B705C] text-white rounded-br-md"
                    : "bg-[#F7F4F0] text-[#3D3229] rounded-bl-md"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.body}
                </p>
                <p
                  className={`text-[11px] mt-1 ${
                    isMine ? "text-white/60" : "text-[#C4BBB2]"
                  }`}
                >
                  {timeLabel(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[#EDE8E2]">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-xl bg-[#F7F4F0] px-4 py-2.5 text-[15px] text-[#3D3229] placeholder:text-[#C4BBB2] focus:outline-none focus:ring-2 focus:ring-[#A5A58D]/40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0 w-10 h-10 rounded-full bg-[#6B705C] flex items-center justify-center text-white disabled:opacity-40 transition-opacity active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
