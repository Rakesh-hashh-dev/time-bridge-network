import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type ExchangeWithDetails = Tables<"exchanges"> & {
  skills: Tables<"skills">;
  requester: Tables<"profiles">;
  provider: Tables<"profiles">;
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  accepted: "bg-accent/10 text-accent",
  completed: "bg-primary/10 text-primary",
  declined: "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [exchanges, setExchanges] = useState<ExchangeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchExchanges();
  }, [user, authLoading]);

  const fetchExchanges = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("exchanges")
      .select("*, skills(*), requester:profiles!exchanges_requester_id_fkey(*), provider:profiles!exchanges_provider_id_fkey(*)")
      .or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExchanges(data as ExchangeWithDetails[]);
    }
    setLoading(false);
  };

  const updateExchange = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("exchanges")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update exchange");
    } else {
      toast.success(`Exchange ${status}`);
      fetchExchanges();
    }
  };

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  const pendingCount = exchanges.filter((e) => e.status === "pending").length;
  const acceptedCount = exchanges.filter((e) => e.status === "accepted").length;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-8">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, {profile?.full_name || "there"}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Credits</p>
                <p className="text-2xl font-bold tabular-nums text-accent">{profile?.time_credits ?? 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exchanges</p>
                <p className="text-2xl font-bold tabular-nums">{profile?.total_exchanges ?? 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <span className="text-lg">★</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold tabular-nums">{Number(profile?.rating) || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold tabular-nums">{acceptedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl">Exchange Requests</h2>
          {exchanges.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No exchange requests yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {exchanges.map((exchange) => (
                <div key={exchange.id} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={exchange.requester.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(exchange.requester.full_name || "A")}&background=4F46E5&color=fff`}
                      alt="" className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {exchange.requester.full_name || "Someone"} → {exchange.skills.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{exchange.hours}h · {new Date(exchange.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[exchange.status]}>{exchange.status}</Badge>
                    {exchange.status === "pending" && exchange.provider_id === user?.id && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => updateExchange(exchange.id, "accepted")}>
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 gap-1" onClick={() => updateExchange(exchange.id, "declined")}>
                          <XCircle className="h-3.5 w-3.5" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
