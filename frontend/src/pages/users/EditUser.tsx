import { useState } from "react";
import { updateUser } from "../../api/users";
import type { Action, EditUserProps } from "../../types";
import UserForm from "../../components/UserForm";

export default function EditUserForm({ user, onSuccess, onCancel }: EditUserProps) {
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
