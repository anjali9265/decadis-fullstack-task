export type Action = "create-item" | "delete-item" | "view-item" | "move-item";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  actions: Action[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserBody {
  firstname: string;
  lastname: string;
  email: string;
  actions?: Action[];
}

export interface UpdateUserBody {
  firstname?: string;
  lastname?: string;
  email?: string;
  actions?: Action[];
}

export interface RunActionBody {
  userId: number;
  action: Action;
}
