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

export interface EditUserProps {
  user: { id: number; firstname: string; lastname: string; email: string; actions: Action[] };
  onSuccess: () => void;
  onCancel: () => void;
}

export interface RunActionProps {
  user: User;
  onCancel: () => void;
}

export interface UserDetailsProps {
  user: User;
}

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export interface UserFormProps {
  initialValues?: {
    firstname: string;
    lastname: string;
    email: string;
    actions: Action[];
  };
  onSubmit: (data: {
    firstname: string;
    lastname: string;
    email: string;
    actions: Action[];
  }) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

export type ValidationResult = {
  valid: boolean;
  error: string;
};

export type UserInput = {
  firstname?: string;
  lastname?: string;
  email?: string;
};
