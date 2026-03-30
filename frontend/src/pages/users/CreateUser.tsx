import { useState } from "react";
import { createUser } from "@/api/users";
import type { Action, FormActionProps } from "@/types";
import UserForm from "@/components/UserForm";
import { validateUserInput } from "@/helpers/validation";

export default function CreateUserForm({ onSuccess, onCancel }: FormActionProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    actions: Action[];
  }) => {
    const { valid, error } = validateUserInput(data);
    if (!valid) {
      setError(error);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createUser(data);
      onSuccess();
    } catch {
      setError("User creation failed");
    } finally {
      setLoading(false);
    }
  };

  return <UserForm onSubmit={handleSubmit} onCancel={onCancel} loading={loading} error={error} />;
}
