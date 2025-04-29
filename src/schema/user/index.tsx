import { z } from "zod";

export const LoginSchema = z.object({
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().email({ message: "Formato de email inválido" }).optional()
  ),
  password: z.string(),
});

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().email({ message: "Formato de email inválido" }).optional()
  ),
  password: z.string(),
});
