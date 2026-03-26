export type Action = "create-item" | "delete-item" | "view-item" | "move-item";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  actions: Action[];
}

export interface FormActionProps {
  onSuccess: () => void;
  onCancel: () => void;
}
