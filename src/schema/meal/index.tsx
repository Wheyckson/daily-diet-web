import { z } from "zod";

export const MealEditSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  hour: z.string(),
  is_in_diet: z.string(),
});

export const CreateMealSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  hour: z.string(),
  is_in_diet: z.string(),
});
