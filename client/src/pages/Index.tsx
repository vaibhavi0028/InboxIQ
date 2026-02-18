import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Mail,
  Shield,
  Zap,
  Tags,
  Reply,
  Sparkles,
  Lock,
  Eye,
  Server,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  {
    icon: Brain,
    title: "AI Classification",
    desc: "Emails are automatically sorted into categories using Gemini AI — no manual labeling needed.",
  },
  {
    icon: Reply,
    title: "Smart Auto-Reply",
    desc: "Generate context-aware replies instantly. One click to draft, review, and send.",
  },
  {
    icon: Tags,
    title: "Intelligent Labels",
    desc: "Auto-apply Gmail labels based on content, sender, and your custom priority rules.",
  },
  {
    icon: Sparkles,
    title: "Email Summarizer",
    desc: "Get the gist of long threads in seconds. AI distills key points from any email.",
  },
  {
    icon: Zap,
    title: "Priority Engine",
    desc: "Define your own category priority order. Important emails always surface first.",
  },
  {
    icon: Mail,
    title: "Compose & Send",
    desc: "Write rich HTML emails with a built-in editor. Send directly from the dashboard.",
  },
];

const securityItems = [
  { icon: Lock, title: "OAuth 2.0", desc: "Secure Google authentication — we never see your password." },
  { icon: Eye, title: "No Data Storage", desc: "Emails are processed in real-time. Nothing is stored on our servers." },
  { icon: Shield, title: "HttpOnly Cookies", desc: "Session tokens are secure and inaccessible to JavaScript." },
  { icon: Server, title: "Encrypted Transit", desc: "All API communication is encrypted with TLS/SSL." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
              <img src="/logo.png" alt="InboxIQ logo" className="h-9 w-9 rounded-lg object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">InboxIQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 text-5xl pt-16 font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your Inbox,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Intelligently
            </span>{" "}
            Managed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            InboxIQ uses AI to classify, summarize, and auto-reply to your emails.
            Spend less time in your inbox and more time on what matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/login">
              <Button size="lg" className="gap-2 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                <Mail className="h-5 w-5" />
                Sign in with Google
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mx-auto mt-16 max-w-3xl"
          >
            <div className="rounded-xl border border-border bg-card p-1 shadow-2xl shadow-primary/5">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-primary/40" />
                  <div className="h-3 w-3 rounded-full bg-primary/20" />
                  <div className="ml-4 h-5 w-48 rounded bg-muted" />
                </div>
                <div className="flex gap-3">
                  <div className="w-48 space-y-2 rounded-lg bg-card p-3">
                    {["Inbox", "Classified", "Compose", "Profile"].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                        <div className="h-3 w-3 rounded bg-primary/30" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                        className="flex items-center gap-3 rounded-lg bg-card p-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/20" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-3/4 rounded bg-muted" />
                          <div className="h-2 w-1/2 rounded bg-muted/60" />
                        </div>
                        <div className="h-5 w-16 rounded-full bg-primary/10 text-[10px] leading-5 text-center text-primary">
                          {["Work", "Finance", "Social", "Promo"][i - 1]}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything Your Inbox Needs</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Powerful AI features that transform how you handle email. Set it up once, let InboxIQ do the rest.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-32 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Built on Trust & Security</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Your privacy is non-negotiable. InboxIQ follows security best practices at every layer.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2">
            {securityItems.map((s, i) => (
              <motion.div
                key={s.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Tame Your Inbox?</h2>
          <p className="mb-8 text-muted-foreground">
            Connect your Gmail and let AI handle the noise. Free to get started.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2 px-8 text-base font-semibold shadow-lg shadow-primary/20">
              <Mail className="h-5 w-5" />
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-primary" />
            <span>InboxIQ</span>
          </div>
          <span>© {new Date().getFullYear()} InboxIQ. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
