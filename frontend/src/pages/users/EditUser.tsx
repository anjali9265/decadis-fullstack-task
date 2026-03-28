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

    if (!data.firstname || !data.lastname || !data.email) {
      setError("Firstname, lastname and email are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address.");
      return;
    }
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
