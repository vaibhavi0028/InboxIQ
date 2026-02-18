import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

interface GroupedEmails {
  [category: string]: Email[];
}

const Classified = () => {
  const [grouped, setGrouped] = useState<GroupedEmails>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchClassified = async () => {
    setLoading(true);
    try {
      const res = await api.get("/emails/classified");
      const data = res.data;
      if (data.classified) {
        setGrouped(data.classified);
      } else if (Array.isArray(data)) {
        const g: GroupedEmails = {};
        data.forEach((e: Email) => {
          const cat = e.category || "Uncategorized";
          if (!g[cat]) g[cat] = [];
          g[cat].push(e);
        });
        setGrouped(g);
      }
    } catch {
      setGrouped({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassified();
  }, []);

  const categories = Object.keys(grouped);

  return (
    <AnimatedWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Classified Emails</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search classified..."
                className="w-64 pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchClassified} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-32" />
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <Inbox className="mb-4 h-16 w-16 opacity-30" />
            <p className="text-lg font-medium">No classified emails</p>
            <p className="text-sm">Emails will appear here once classified by AI</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const emails = grouped[category].filter(
                (e) =>
                  e.subject?.toLowerCase().includes(search.toLowerCase()) ||
                  e.from?.toLowerCase().includes(search.toLowerCase())
              );
              if (emails.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{category}</h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {emails.length}
                    </span>
                  </div>
                  <AnimatePresence>
                    <div className="space-y-2">
                      {emails.map((email, i) => (
                        <motion.div
                          key={email.id || i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <EmailCard email={email} showActions />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default Classified;
