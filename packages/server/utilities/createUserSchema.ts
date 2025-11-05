import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .min(8, { message: "Username must be at least 8 characters long." })
        .max(32, { message: "Username cannot exceed 32 characters." }),
  email: z.email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(32, { message: "Password cannot exceed 32 characters." })
    .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter."})
    .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter."})
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character."}),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema.omit({password: true, name: true, confirmPassword: true}).extend({password: z.string().nonempty({message: "Password is required"})});

export type LoginInput = z.infer<typeof loginSchema>;