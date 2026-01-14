import { z } from "zod";

// Password validation: min 8 chars, at least 1 letter and 1 number
const passwordValidation = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número");

// Available roles
export const userRoles = ["admin", "editor", "viewer"] as const;
export type UserRole = (typeof userRoles)[number];

// Schema for creating a new user
export const createUserSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: passwordValidation,
    confirmPassword: z.string(),
    role: z.enum(userRoles, {
      message: "Selecione um papel válido",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Schema for updating a user (password is optional)
export const updateUserSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: passwordValidation.optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    role: z.enum(userRoles, {
      message: "Selecione um papel válido",
    }),
  })
  .refine(
    (data) => {
      // Only validate password match if password is provided
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Schema for API create (without confirmPassword, as it's validated on client)
export const apiCreateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: passwordValidation,
  role: z.enum(userRoles),
});

// Schema for API update
export const apiUpdateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: passwordValidation.optional().or(z.literal("")),
  role: z.enum(userRoles),
});
