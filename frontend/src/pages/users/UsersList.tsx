import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/users";
import type { User } from "../../types";
import Modal from "../../components/Modal";
import CreateUserForm from "./CreateUser";
import EditUserForm from "./EditUser";
import RunActionForm from "./RunAction";
import UserDetails from "./UserDetails";
import { Pencil, Trash2, Play, Eye } from "lucide-react";

type ModalType = "create" | "edit" | "action" | "view" | null;

export default function UserList() {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <button
            onClick={() => openModal("create")}
            className="px-5 py-2 text-sm text-white bg-teal hover:bg-teal-hover rounded-lg cursor-pointer"
          >
            Create
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading users...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-sm text-gray-500">No users yet.</p>
        )}

        {users.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">NAME</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">E-MAIL</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal("edit", user)}
                          className="p-1.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => openModal("action", user)}
                          className="p-1.5 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                          title="Run Action"
                        >
                          <Play size={14} />
                        </button>
                        <button
                          onClick={() => openModal("view", user)}
                          className="p-1.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
