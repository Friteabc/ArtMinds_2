import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const imageStyles = [
  "realistic", "photographic", "anime", "manga", "digital-art",
  "oil-painting", "watercolor", "sketch", "minimalist", "cyberpunk",
  "steampunk", "fantasy", "3d-render", "pixel-art", "pop-art",
  "comic-book", "abstract", "surrealist", "impressionist", "retro"
] as const;

export const aspectRatios = {
  square: { width: 1024, height: 1024 },
  landscape: { width: 1280, height: 768 },
  portrait: { width: 768, height: 1280 }
} as const;

export const imageGenerations = pgTable("image_generations", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  seed: integer("seed").notNull(),
  imageUrl: text("image_url").notNull(),
  displayUrl: text("display_url").notNull(),
  deleteUrl: text("delete_url"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  style: text("style").notNull(),
  createdAt: text("created_at").notNull()
});

export const imageGenerationSchema = createInsertSchema(imageGenerations).pick({
  prompt: true,
  negativePrompt: true,
  seed: true,
  imageUrl: true,
  displayUrl: true,
  deleteUrl: true,
  width: true,
  height: true,
  style: true,
  createdAt: true
});

export const defaultNegativePrompt = "blurry, bad quality, distorted, deformed, ugly, bad anatomy, disfigured, poorly drawn face, poorly drawn hands, missing limbs, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated";

export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  negativePrompt: z.string().default(defaultNegativePrompt),
  seed: z.number().optional(),
  style: z.enum(imageStyles),
  aspectRatio: z.enum(["square", "landscape", "portrait"]).default("square")
});

export type InsertImageGeneration = z.infer<typeof imageGenerationSchema>;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Firebase UID
  email: text("email").notNull(),
  credits: integer("credits").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSchema = createInsertSchema(users);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof userSchema>;