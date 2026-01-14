"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserInput,
  UpdateUserInput,
  userRoles,
  UserRole,
} from "@/lib/validations/userSchemas";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Visualizador",
};

export function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserFormModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: isEditing
      ? {
          name: user.name || "",
          email: user.email,
          role: user.role as UserRole,
          password: "",
          confirmPassword: "",
        }
      : {
          name: "",
          email: "",
          role: "viewer",
          password: "",
          confirmPassword: "",
        },
  });

  // Reset form when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        role: (user?.role as UserRole) || "viewer",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, user, reset]);

  const password = watch("password");

  // Password strength indicators
  const passwordChecks = {
    minLength: (password?.length ?? 0) >= 8,
    hasLetter: /[a-zA-Z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
  };

  const onSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const url = isEditing
        ? `/api/admin/users/${user.id}`
        : "/api/admin/users";
      const method = isEditing ? "PUT" : "POST";

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = data;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || "Ocorreu um erro");
        return;
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      setApiError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setApiError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* API Error */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                errors.name
                  ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                  : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              }`}
              placeholder="Nome completo"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                errors.email
                  ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                  : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              }`}
              placeholder="usuario@email.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Papel
            </label>
            <select
              {...register("role")}
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all bg-white ${
                errors.role
                  ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                  : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              }`}
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1.5 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {isEditing ? "Senha (deixe vazio para manter atual)" : "Senha"}
            </label>
            {isEditing && (
              <p className="text-xs text-slate-500 mb-2">
                Preencha apenas se deseja alterar a senha. A nova senha substituirá a atual.
              </p>
            )}
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 pr-12 border rounded-xl outline-none transition-all ${
                  errors.password
                    ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}

            {/* Password strength indicator */}
            {password && password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.minLength ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span
                    className={
                      passwordChecks.minLength
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.hasLetter ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span
                    className={
                      passwordChecks.hasLetter
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    Contém letra
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.hasNumber ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span
                    className={
                      passwordChecks.hasNumber
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    Contém número
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-3 pr-12 border rounded-xl outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
