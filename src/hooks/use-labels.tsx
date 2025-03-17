"use client";

import { useState, useEffect } from "react";

interface BibleLabel {
  id: string;
  name: string;
  color: string;
}

export function useLabels() {
  const [labels, setLabels] = useState<BibleLabel[]>([]);

  useEffect(() => {
    try {
      const savedLabels = localStorage.getItem("bible-labels");
      if (savedLabels) {
        setLabels(JSON.parse(savedLabels));
      } else {
        setLabels([]);
      }
    } catch (error) {
      console.error("Error loading labels:", error);
      setLabels([]);
    }
  }, []);

  const saveLabels = (updatedLabels: BibleLabel[]) => {
    try {
      localStorage.setItem("bible-labels", JSON.stringify(updatedLabels));
      setLabels(updatedLabels);
    } catch (error) {
      console.error("Error saving labels:", error);
    }
  };

  const addLabel = (name: string, color: string) => {
    const newLabel: BibleLabel = {
      id: `label-${Date.now()}`,
      name,
      color,
    };

    const updatedLabels = [...labels, newLabel];
    saveLabels(updatedLabels);

    return newLabel;
  };

  const deleteLabel = (labelId: string) => {
    const updatedLabels = labels.filter((label) => label.id !== labelId);
    saveLabels(updatedLabels);
  };

  const updateLabel = (labelId: string, name: string, color: string) => {
    const updatedLabels = labels.map((label) =>
      label.id === labelId ? { ...label, name, color } : label
    );
    saveLabels(updatedLabels);
  };

  return {
    labels,
    setLabels,
    addLabel,
    deleteLabel,
    updateLabel,
  };
}
