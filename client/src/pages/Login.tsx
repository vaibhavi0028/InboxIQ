import { motion } from "framer-motion";
import { Mail, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[80px]" />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Inbox className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Welcome to InboxIQ</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your inbox with AI
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full gap-3 py-6 text-base font-semibold shadow-lg shadow-primary/20"
            size="lg"
          >
            <Mail className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            We only access your Gmail to classify and manage emails. Your data stays private.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
