import { useState } from "react";
import { runAction } from "../../api/users";
import type { Action, RunActionProps } from "../../types";
import { ALL_ACTIONS } from "../../constants/actions";

export default function RunActionForm({ user, onCancel }: RunActionProps) {
  const [action, setAction] = useState<Action | "">("");
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunAction = async () => {
    if (!action) return;
    setLoading(true);
    setResult(null);

    try {
      const { status, data } = await runAction(user.id, action);
      setResult({
        success: status === 200,
        message: data.message ?? data.error ?? "Unknown response",
      });
    } catch {
      setResult({ success: false, message: "Running action failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select action</label>
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value as Action);
            setResult(null);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ALL_ACTIONS.map((action: {value:string, label:string}) => (
            <option key={action.value} value={action.value}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      {result && (
        <div
          className={`text-sm rounded-lg px-4 py-3 border ${
            result.success
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleRunAction}
          disabled={!action || loading}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running" : "Run"}
        </button>
      </div>
    </div>
  );
}
