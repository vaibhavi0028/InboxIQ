import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axios";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Compose = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  var formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const handleSend = async () => {
    if (!to || !subject || !body || body === "<p><br></p>") {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      await api.post("/automation/send", { to, subject, body });
      setSent(true);
      console.log(body);
      toast({ title: "Email sent!", description: `Message sent to ${to}` });
      setTimeout(() => {
        setSent(false);
        setTo("");
        setSubject("");
        setBody("");
      }, 3000);
    } catch {
      toast({
        title: "Send failed",
        description: "Could not send email. Try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatedWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Compose Email</h1>
          <p className="text-sm text-muted-foreground">
            Write and send emails directly from InboxIQ
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="mb-4 h-16 w-16 text-primary" />
            </motion.div>
            <p className="text-xl font-semibold">Email Sent Successfully!</p>
            <p className="text-sm text-muted-foreground">
              Your message has been delivered
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <div className="rounded-md border border-input [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-input [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-foreground [&_.ql-editor.ql-blank::before]:text-muted-foreground">
                <ReactQuill
                  theme="snow"
                  value={body}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your email..."
                  onChange={setBody}
                ></ReactQuill>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSend}
                disabled={sending}
                className="gap-2 px-6"
              >
                {sending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default Compose;
