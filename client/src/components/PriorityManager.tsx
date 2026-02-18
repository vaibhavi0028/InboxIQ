import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { categoriesAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PriorityManagerProps {
  categories: string[];
  priorityOrder: string[];
  onUpdate: () => void;
}

export function PriorityManager({ categories, priorityOrder, onUpdate }: PriorityManagerProps) {
  const [order, setOrder] = useState<string[]>(priorityOrder.length > 0 ? priorityOrder : categories);
  const [saving, setSaving] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...order];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setOrder(next);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const next = [...order];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setOrder(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await categoriesAPI.setPriority(order);
      toast({ title: "Priority saved" });
      onUpdate();
    } catch {
      toast({ title: "Error", description: "Failed to save priority", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {order.map((cat, i) => (
          <motion.div
            key={cat}
            layout
            className="flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-accent/30 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">{i + 1}</Badge>
            <span className="flex-1 text-sm font-medium">{cat}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(i)} disabled={i === 0}>
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(i)} disabled={i === order.length - 1}>
              <ArrowDown className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </div>
      {order.length === 0 && (
        <p className="text-sm text-muted-foreground">No categories to prioritize.</p>
      )}
      {order.length > 0 && (
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Priority Order
        </Button>
      )}
    </div>
  );
}
