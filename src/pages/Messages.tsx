import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"messages">;
type Profile = Tables<"profiles">;

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchConversations();
  }, [user, authLoading]);

  useEffect(() => {
    if (!selected || !user) return;
    fetchMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender_id === user.id && msg.receiver_id === selected.id) ||
            (msg.sender_id === selected.id && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;
    // Get all unique users this user has exchanged messages with
    const { data: sent } = await supabase
      .from("messages")
      .select("receiver_id")
      .eq("sender_id", user.id);
    const { data: received } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("receiver_id", user.id);

    const ids = new Set<string>();
    sent?.forEach((m) => ids.add(m.receiver_id));
    received?.forEach((m) => ids.add(m.sender_id));

    // Also get users from exchanges
    const { data: exchanges } = await supabase
      .from("exchanges")
      .select("requester_id, provider_id")
      .or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`);

    exchanges?.forEach((e) => {
      if (e.requester_id !== user.id) ids.add(e.requester_id);
      if (e.provider_id !== user.id) ids.add(e.provider_id);
    });

    if (ids.size === 0) { setConversations([]); return; }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", Array.from(ids));

    setConversations(profiles || []);
    if (profiles && profiles.length > 0 && !selected) {
      setSelected(profiles[0]);
    }
  };

  const fetchMessages = async () => {
    if (!user || !selected) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${selected.id}),and(sender_id.eq.${selected.id},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || !selected) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selected.id,
      content: input.trim(),
    });
    if (!error) setInput("");
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r bg-card md:w-80">
        <div className="border-b p-4">
          <h2 className="font-display text-xl">Messages</h2>
        </div>
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No conversations yet. Request an exchange to start chatting!</p>
        ) : (
          <div className="divide-y">
            {conversations.map((profile) => {
              const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "A")}&background=4F46E5&color=fff`;
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelected(profile)}
                  className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary ${selected?.id === profile.id ? "bg-secondary" : ""}`}
                >
                  <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full" />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-card-foreground">{profile.full_name || "Anonymous"}</p>
                    <p className="truncate text-xs text-muted-foreground">{profile.location || ""}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex flex-1 flex-col">
        {selected ? (
          <>
            <div className="flex items-center gap-3 border-b px-6 py-4">
              <img
                src={selected.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.full_name || "A")}&background=4F46E5&color=fff`}
                alt="" className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{selected.full_name || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">{selected.location || ""}</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    <p>{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${msg.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t p-4">
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              >
                <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
                <Button size="icon" type="submit"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
