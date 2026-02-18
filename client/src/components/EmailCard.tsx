import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Reply, Tag, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axios";

interface EmailProps {
  email: {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
    category?: string;
    messageId?: string;
  };
  showActions?: boolean;
}

const EmailCard = ({ email, showActions = false }: EmailProps) => {
  const [expanded, setExpanded] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const initials = email.from
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  const handleAction = async (action: string) => {
    setLoading(action);
    try {
      let res;
      switch (action) {
        case "summarize":
          res = await api.post("/automation/summarize", {
            subject: email.subject,
            snippet: email.snippet,
          });
          setResult(res.data.summary || res.data.result || JSON.stringify(res.data));
          break;
        case "reply":
          res = await api.post("/automation/reply", {
            to: email.from,
            subject: email.subject,
            snippet: email.snippet,
          });
          setResult(res.data.reply || res.data.result || JSON.stringify(res.data));
          break;
        case "label":
          res = await api.post("/automation/label", {
            messageId: email.messageId || email.id,
            label: email.category || "General",
          });
          toast({ title: "Label applied", description: `Applied "${email.category || "General"}" label` });
          break;
        case "auto-reply":
          res = await api.post("/automation/auto-reply");
          toast({ title: "Auto-reply sent" });
          break;
      }
    } catch {
      toast({ title: "Action failed", description: `Could not ${action}. Try again.`, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-sm">{email.from}</p>
            <div className="flex items-center gap-2 shrink-0">
              {email.category && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {email.category}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{email.date}</span>
            </div>
          </div>
          <p className="mt-0.5 text-sm font-medium">{email.subject}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{email.snippet}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="mt-1 text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 border-t border-border pt-4"
        >
          <p className="mb-4 text-sm text-muted-foreground">{email.snippet}</p>

          {showActions && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("summarize")}
                disabled={loading === "summarize"}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loading === "summarize" ? "Summarizing..." : "Summarize"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("reply")}
                disabled={loading === "reply"}
                className="gap-1.5"
              >
                <Reply className="h-3.5 w-3.5" />
                {loading === "reply" ? "Generating..." : "AI Reply"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("label")}
                disabled={loading === "label"}
                className="gap-1.5"
              >
                <Tag className="h-3.5 w-3.5" />
                {loading === "label" ? "Applying..." : "Apply Label"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("auto-reply")}
                disabled={loading === "auto-reply"}
                className="gap-1.5"
              >
                <Zap className="h-3.5 w-3.5" />
                {loading === "auto-reply" ? "Sending..." : "Auto Reply"}
              </Button>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-muted/50 p-4"
            >
              <p className="mb-1 text-xs font-semibold text-primary">AI Result</p>
              <p className="whitespace-pre-wrap text-sm">{result}</p>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => setResult(null)}>
                Dismiss
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmailCard;
