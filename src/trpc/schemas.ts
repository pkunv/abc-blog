import { z } from "zod";

export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3).max(128),
  content: z.string().min(3),
  keywords: z.string().max(255),
  category: z.string().max(16).optional(),
});
