import type { UserDetailsProps } from "@/types";

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex">
        <span className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Firstname
        </span>
        <span className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm text-gray-900">
          {user.firstname}
        </span>
      </div>

      <div className="flex">
        <span className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Lastname
        </span>
        <span className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm text-gray-900">
          {user.lastname}
        </span>
      </div>

      <div className="flex">
        <span className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Email
        </span>
        <span className="w-full border border-gray-300 border-l-0 px-3 py-2 text-sm text-gray-900">
          {user.email}
        </span>
      </div>

      <div className="flex">
        <span className="w-28 shrink-0 text-sm font-medium border border-gray-300 text-gray-700 bg-gray-100 px-2 py-2">
          Actions
        </span>
        <div className="w-full border border-gray-300 border-l-0 px-3 py-2">
          {user.actions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.actions.map((action) => (
                <span
                  key={action}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md"
                >
                  {action}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No actions assigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
