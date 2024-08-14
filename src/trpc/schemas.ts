import { z } from "zod";

export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  content: z.string(),
  keywords: z.string(),
});
