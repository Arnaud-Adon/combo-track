import z from "zod";

export const signInSchema = z.object({
  email: z.string().email().min(1, "Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
    confirmPassword: z.string(),
    image: z.string().url().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
