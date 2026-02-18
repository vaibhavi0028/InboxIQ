import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Plus, GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useCategoryStore } from "@/store/categoryStore";
import AnimatedWrapper from "@/components/AnimatedWrapper";

const Profile = () => {
  const { user } = useAuthStore();
  const { categories, priorityOrder, fetchCategories, addCategory, updatePriority } = useCategoryStore();
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory.trim());
      toast({ title: "Category added", description: `"${newCategory}" has been added.` });
      setNewCategory("");
    } catch {
      toast({ title: "Error", description: "Could not add category.", variant: "destructive" });
    }
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDrop = async (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...priorityOrder];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    try {
      await updatePriority(reordered);
      toast({ title: "Priority updated" });
    } catch {
      toast({ title: "Error", description: "Could not update priority.", variant: "destructive" });
    }
    setDragIdx(null);
  };

  return (
    <AnimatedWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img src={user.picture} alt="avatar" className="h-14 w-14 rounded-full" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{user?.name || "User"}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" /> {user?.email || "Not connected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Manager */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button onClick={handleAddCategory} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {cat}
                  </span>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">No categories yet. Add one above.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Manager */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Order</CardTitle>
            </CardHeader>
            <CardContent>
              {priorityOrder.length === 0 ? (
                <p className="text-sm text-muted-foreground">No priority order set. Add categories first.</p>
              ) : (
                <div className="space-y-2">
                  {priorityOrder.map((cat, idx) => (
                    <motion.div
                      key={cat}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(idx)}
                      whileHover={{ scale: 1.01 }}
                      className="flex cursor-grab items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{cat}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedWrapper>
  );
};

export default Profile;
