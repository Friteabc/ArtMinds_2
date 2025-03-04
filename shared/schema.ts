import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const imageGenerations = pgTable("image_generations", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  seed: integer("seed").notNull(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: text("created_at").notNull()
});

export const imageGenerationSchema = createInsertSchema(imageGenerations).pick({
  prompt: true,
  negativePrompt: true,
  seed: true,
  imageUrl: true,
  width: true,
  height: true,
  createdAt: true
});

export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  negativePrompt: z.string().optional(),
  seed: z.number().optional(),
  aspectRatio: z.enum(["square", "landscape", "portrait"]).default("square")
});

export type InsertImageGeneration = z.infer<typeof imageGenerationSchema>;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;