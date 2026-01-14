"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Shield,
  Edit3,
  Eye,
  AlertCircle,
} from "lucide-react";
import { UserFormModal } from "@/components/admin/users/UserFormModal";
import { DeleteUserModal } from "@/components/admin/users/DeleteUserModal";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
}

const roleConfig = {
  admin: {
    label: "Administrador",
    icon: Shield,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    iconColor: "text-purple-500",
  },
  editor: {
    label: "Editor",
    icon: Edit3,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
  viewer: {
    label: "Visualizador",
    icon: Eye,
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    iconColor: "text-slate-500",
  },
};

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Falha ao carregar usuários");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(result.error || "Erro ao excluir usuário");
        return;
      }

      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      setDeleteError("Erro de conexão. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleConfig = (role: string) => {
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
  };

  // Check if user is current session user (for self-delete protection visual)
  const isCurrentUser = (userId: string) => session?.user?.id === userId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestão de Usuários
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie acessos e permissões do sistema
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={fetchUsers}
            className="ml-auto text-sm font-medium text-red-600 hover:text-red-800"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-slate-500 mb-6">
              Comece criando o primeiro usuário do sistema.
            </p>
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Usuário
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const role = getRoleConfig(user.role);
                  const RoleIcon = role.icon;
                  const isSelf = isCurrentUser(user.id);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {user.name || "Sem nome"}
                              </p>
                              {isSelf && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                                  Você
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${role.bgColor} ${role.textColor}`}
                        >
                          <RoleIcon className={`w-4 h-4 ${role.iconColor}`} />
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            disabled={isSelf}
                            className={`p-2 rounded-lg transition-colors ${
                              isSelf
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            }`}
                            title={isSelf ? "Você não pode excluir sua própria conta" : "Excluir"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Error Toast */}
      {deleteError && (
        <div className="fixed bottom-6 right-6 p-4 bg-red-600 text-white rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 p-1 hover:bg-white/20 rounded"
          >
            ×
          </button>
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        user={selectedUser}
        isDeleting={isDeleting}
      />
    </div>
  );
}
