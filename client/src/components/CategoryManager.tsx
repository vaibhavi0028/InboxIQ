import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, X } from "lucide-react";
import { categoriesAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryManagerProps {
  categories: string[];
  onUpdate: () => void;
}

export function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newCat.trim()) return;
    setLoading(true);
    try {
      await categoriesAPI.addCategory(newCat.trim());
      toast({ title: "Category added", description: newCat.trim() });
      setNewCat("");
      onUpdate();
    } catch {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New category..."
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={loading || !newCat.trim()} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {cat}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No categories yet. Add one above!</p>
      )}
    </div>
  );
}
