import type { Express } from "express";
import { createServer } from "http";
import { generateImageSchema, aspectRatios, defaultNegativePrompt } from "@shared/schema";
import { ZodError } from "zod";

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_KEY = process.env.HF_API_KEY;

const stylePrompts = {
  "realistic": "realistic, high quality, photorealistic, highly detailed",
  "photographic": "professional photography, high quality photo, 8k uhd",
  "anime": "anime style, anime art, japanese anime, studio ghibli",
  "manga": "manga style, japanese manga, black and white, ink drawing",
  "digital-art": "digital art, digital painting, concept art",
  "oil-painting": "oil painting, traditional art, painted on canvas",
  "watercolor": "watercolor painting, watercolor art, paint strokes",
  "sketch": "pencil sketch, hand drawn, graphite drawing",
  "minimalist": "minimalist style, simple, clean lines, minimal",
  "cyberpunk": "cyberpunk style, neon, futuristic, sci-fi",
  "steampunk": "steampunk style, victorian, mechanical, brass",
  "fantasy": "fantasy art, magical, mythical, epic",
  "3d-render": "3D render, octane render, unreal engine 5",
  "pixel-art": "pixel art, 8-bit style, retro game art",
  "pop-art": "pop art style, andy warhol, bold colors",
  "comic-book": "comic book style, comic art, cel shaded",
  "abstract": "abstract art, non-representational, modern art",
  "surrealist": "surrealist art, surrealism, dreamlike, salvador dali style",
  "impressionist": "impressionist style, impressionism, claude monet style",
  "retro": "retro style, vintage, old school"
};

export async function registerRoutes(app: Express) {
  app.post("/api/generate", async (req, res) => {
    try {
      const input = generateImageSchema.parse(req.body);
      const dimensions = aspectRatios[input.aspectRatio];

      // Combine style prompt with user prompt
      const stylePrompt = stylePrompts[input.style];
      const finalPrompt = `${input.prompt}, ${stylePrompt}`;

      if (!HF_API_KEY) {
        throw new Error("Hugging Face API key not configured");
      }

      const payload = {
        inputs: finalPrompt,
        parameters: {
          negative_prompt: input.negativePrompt || defaultNegativePrompt,
          num_inference_steps: 60,
          guidance_scale: 8.0,
          seed: input.seed || Math.floor(Math.random() * 2**32),
          width: dimensions.width,
          height: dimensions.height
        }
      };

      console.log("Sending request to Hugging Face API:", {
        url: HF_API_URL,
        prompt: finalPrompt,
        dimensions,
        seed: payload.parameters.seed
      });

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Hugging Face API error:", error);
        throw new Error("Failed to generate image");
      }

      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');

      res.json({ 
        imageUrl: `data:image/png;base64,${base64Image}`,
        seed: payload.parameters.seed
      });

    } catch (error) {
      console.error("Error in /api/generate:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Échec de la génération de l'image" });
      }
    }
  });

  return createServer(app);
}