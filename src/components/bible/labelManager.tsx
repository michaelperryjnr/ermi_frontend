"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useLabels } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Default highlight colors
const highlightColors = [
  "#FFD700", // Gold
  "#90EE90", // Light Green
  "#FFB6C1", // Light Pink
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
];

export function LabelManager() {
  const { labels, addLabel, deleteLabel } = useLabels();
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(highlightColors[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return;

    addLabel(newLabelName, newLabelColor);
    setNewLabelName("");
    setNewLabelColor(highlightColors[0]);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Labels</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Label
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Label</DialogTitle>
              <DialogDescription>
                Create a new label to organize your Bible notes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label-name">Label Name</Label>
                <Input
                  id="label-name"
                  placeholder="Enter label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Label Color</Label>
                <div className="flex flex-wrap gap-2">
                  {highlightColors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full transition-all ${
                        newLabelColor === color
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLabel}>Create Label</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing labels */}
      <div className="space-y-2">
        <ScrollArea className="h-[300px] pr-4">
          {labels.length > 0 ? (
            <div className="space-y-2">
              {labels.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="font-medium">{label.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteLabel(label.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <p className="text-muted-foreground mb-2">No labels yet</p>
              <p className="text-sm text-muted-foreground">
                Create labels to organize your Bible notes
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
