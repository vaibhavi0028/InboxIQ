import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, RefreshCw, Inbox as InboxIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api/axios";
import EmailCard from "@/components/EmailCard";
import AnimatedWrapper from "@/components/AnimatedWrapper";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category?: string;
  messageId?: string;
}

const Dashboard = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await api.get("/emails", { params: { limit } });
      setEmails(res.data.emails || res.data || []);
    } catch {
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [limit]);

  const filtered = emails.filter(
    (e) =>
      e.subject?.toLowerCase().includes(search.toLowerCase()) ||
      e.from?.toLowerCase().includes(search.toLowerCase()) ||
      e.snippet?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatedWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inbox</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} emails</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emails..."
                className="w-64 pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {limit} <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 50].map((n) => (
                  <DropdownMenuItem key={n} onClick={() => setLimit(n)} className={limit === n ? "bg-accent" : ""}>
                    Show {n}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={fetchEmails} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <InboxIcon className="mb-4 h-16 w-16 opacity-30" />
            <p className="text-lg font-medium">No emails found</p>
            <p className="text-sm">Try adjusting your search or refresh</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {filtered.map((email, i) => (
                <motion.div
                  key={email.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <EmailCard email={email} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default Dashboard;
