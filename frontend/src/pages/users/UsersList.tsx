import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, generateSampleUser } from "@/api/users";
import type { User } from "@/types";
import Modal from "@/components/Modal";
import CreateUserForm from "./CreateUser";
import EditUserForm from "./EditUser";
import RunActionForm from "./RunAction";
import UserDetails from "./UserDetails";
import { Pencil, Trash2, Play, Eye } from "lucide-react";
import IconButton from "@/components/IconButton";

type ModalType = "create" | "edit" | "action" | "view" | null;

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.firstname} ${user.lastname}?`)) return;
    await deleteUser(user.id);
    fetchUsers();
  };

  const openModal = (type: ModalType, user?: User) => {
    setSelectedUser(user ?? null);
    setModalOpen(type);
  };

  const closeModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    closeModal();
    fetchUsers();
  };

  const createSampleUser = async () => {
    try {
      await generateSampleUser();
      fetchUsers(); // refresh list
    } catch {
      setError("Failed to generate sample user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {modalOpen === "create" && (
        <Modal title="Create User" onClose={closeModal}>
          <CreateUserForm onSuccess={handleSuccess} onCancel={closeModal} />
        </Modal>
      )}
      {modalOpen === "edit" && selectedUser && (
        <Modal title="Edit User" onClose={closeModal}>
          <EditUserForm user={selectedUser} onSuccess={handleSuccess} onCancel={closeModal} />
        </Modal>
      )}
      {modalOpen === "action" && selectedUser && (
        <Modal title="Run Action" onClose={closeModal}>
          <RunActionForm user={selectedUser} onCancel={closeModal} />
        </Modal>
      )}
      {modalOpen === "view" && selectedUser && (
        <Modal title="View User" onClose={closeModal}>
          <UserDetails user={selectedUser} />
        </Modal>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
          <button
            onClick={() => openModal("create")}
            className="px-4 py-2 text-sm text-white bg-teal hover:bg-teal-hover rounded-lg cursor-pointer"
          >
            Create
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading users...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-sm text-gray-500">
            No users yet.{" "}
            <button
              onClick={createSampleUser}
              className="text-teal font-medium underline hover:text-teal-hover cursor-pointer"
            >
              Click here
            </button>{" "}
            to generate a sample user.
          </p>
        )}

        {users.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="overflow-x-auto">
              <div className="inline-block w-full border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                        NAME
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                        E-MAIL
                      </th>
                      <th className="px-4 py-3 whitespace-nowrap" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {user.firstname} {user.lastname}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <IconButton
                              onClick={() => openModal("edit", user)}
                              tooltip="Edit"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50"
                            >
                              <Pencil size={14} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(user)}
                              tooltip="Delete"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </IconButton>
                            <IconButton
                              onClick={() => openModal("action", user)}
                              tooltip="Run Action"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Play size={14} />
                            </IconButton>
                            <IconButton
                              onClick={() => openModal("view", user)}
                              tooltip="View"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50"
                            >
                              <Eye size={14} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
