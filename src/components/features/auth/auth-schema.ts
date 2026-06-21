import z from "zod";

export const signInSchema = z.object({
  email: z.string().email().min(1, "auth.validation.emailInvalid"),
  password: z.string().min(1, "auth.validation.passwordRequired"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "auth.validation.nameMin"),
    email: z.string().email("auth.validation.emailInvalid"),
    password: z
      .string()
      .min(8, "auth.validation.passwordMin")
      .regex(/[A-Z]/, "auth.validation.passwordUppercase")
      .regex(/[0-9]/, "auth.validation.passwordNumber"),
    confirmPassword: z.string(),
    image: z.string().url().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.passwordsMismatch",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
