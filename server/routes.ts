import type { Express } from "express";
import { createServer } from "http";
import { generateImageSchema } from "@shared/schema";
import { ZodError } from "zod";

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_KEY = "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";

export async function registerRoutes(app: Express) {
  app.post("/api/generate", async (req, res) => {
    try {
      const input = generateImageSchema.parse(req.body);

      const payload = {
        inputs: input.prompt,
        parameters: {
          negative_prompt: input.negativePrompt || "",
          num_inference_steps: 60,
          guidance_scale: 8.0,
          seed: input.seed || Math.floor(Math.random() * 2**32),
          width: 1024,
          height: 1024
        }
      };

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');

      res.json({ 
        imageUrl: `data:image/png;base64,${base64Image}`,
        seed: payload.parameters.seed
      });

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to generate image" });
      }
    }
  });

  return createServer(app);
}