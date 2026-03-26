import { useState } from "react";
import { updateUser } from "../../api/users";
import type { Action, FormActionProps } from "../../types";
import UserForm from "../../components/UserForm";

interface Props {
  user: { id: number; firstname: string; lastname: string; email: string; actions: Action[] };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditUserForm({ user, onSuccess, onCancel }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    actions: Action[];
  }) => {
    setError("");
    setLoading(true);

    try {
      await updateUser(user.id, data);
      onSuccess();
    } catch {
      setError("User updation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserForm
      initialValues={user}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      error={error}
    />
  );
}
