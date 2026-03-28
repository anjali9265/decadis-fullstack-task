import { useState } from "react";
import { createUser } from "@/api/users";
import type { Action, FormActionProps } from "@/types";
import UserForm from "@/components/UserForm";

export default function CreateUserForm({ onSuccess, onCancel }: FormActionProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    actions: Action[];
  }) => {
    if (!data.firstname || !data.lastname || !data.email) {
      setError("Firstname, lastname and email are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address.");
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
