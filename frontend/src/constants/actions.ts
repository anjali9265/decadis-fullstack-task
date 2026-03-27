import type { Action } from "../types";

export const ALL_ACTIONS: { value: Action; label: string }[] = [
  { value: "create-item", label: "Create Item" },
  { value: "delete-item", label: "Delete Item" },
  { value: "view-item", label: "View Item" },
  { value: "move-item", label: "Move Item" },
];