import { useState } from "react";
import { ALL_ACTIONS } from "../constants/actions";
import type { Action } from "../types";

interface UserFormProps {
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

export default function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
  error,
}: UserFormProps) {
  const [firstname, setFirstname] = useState(initialValues?.firstname ?? "");
  const [lastname, setLastname] = useState(initialValues?.lastname ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [actions, setActions] = useState<Action[]>(initialValues?.actions ?? []);

  const changeAction = (action: Action) => {
    setActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  };

  const handleSubmit = () => {
    onSubmit({ firstname, lastname, email, actions });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex">
        <label className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Firstname
        </label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="Max"
          className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="flex">
        <label className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Lastname
        </label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Mustermann"
          className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="flex">
        <label className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="m.must@test.com"
          className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
        <div className="space-y-2">
          {ALL_ACTIONS.map((action) => (
            <label key={action.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={actions.includes(action.value)}
                onChange={() => changeAction(action.value)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{action.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving" : "Submit"}
        </button>
      </div>
    </div>
  );
}
