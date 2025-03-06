import type { Express } from "express";
import { createServer } from "http";
import { generateImageSchema, aspectRatios, defaultNegativePrompt } from "@shared/schema";
import { ZodError } from "zod";
import { storage } from "./storage";
import axios from "axios";
import FormData from "form-data";

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_KEY = process.env.HF_API_KEY;
const IMGBB_API_KEY = "1a031557e6345c644edaa0aba9105757";

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
  // Route pour créer ou mettre à jour un utilisateur
  app.post("/api/users", async (req, res) => {
    try {
      const { id, email } = req.body;

      if (!id || !email) {
        throw new Error("ID et email requis");
      }

      let user = await storage.getUser(id);

      if (!user) {
        // S'assurer que le nouvel utilisateur reçoit 10 crédits
        user = await storage.createUser({ 
          id, 
          email,
          credits: 10, // Explicitement définir les crédits initiaux
          createdAt: new Date()
        });
        console.log(`Nouvel utilisateur créé avec ${user.credits} crédits:`, { id, email });
      }

      res.json(user);
    } catch (error) {
      console.error("Error in /api/users:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Route pour obtenir les informations d'un utilisateur
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error in /api/users/:id:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, negativePrompt, style, aspectRatio, userId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }

      const input = generateImageSchema.parse({
        prompt,
        negativePrompt,
        style,
        aspectRatio
      });

      // Vérifier les crédits de l'utilisateur
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      console.log(`Vérification des crédits pour l'utilisateur ${userId}:`, {
        creditsDisponibles: user.credits,
        coutGeneration: 3.5
      });

      if (user.credits < 3.5) {
        return res.status(400).json({ message: "Crédits insuffisants pour générer une image (3.5 crédits requis)" });
      }

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

      // Upload to ImgBB
      const formData = new FormData();
      formData.append('image', base64Image);

      const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
        headers: formData.getHeaders()
      });

      const imgbbData = imgbbResponse.data.data;

      // Après la génération réussie, déduire les crédits
      const updatedUser = await storage.updateUserCredits(userId, user.credits - 3.5);
      console.log(`Crédits mis à jour pour l'utilisateur ${userId}:`, {
        ancienSolde: user.credits,
        nouveauSolde: updatedUser.credits
      });

      res.json({ 
        imageUrl: imgbbData.url,
        displayUrl: imgbbData.display_url,
        deleteUrl: imgbbData.delete_url,
        seed: payload.parameters.seed,
        remainingCredits: updatedUser.credits
      });

    } catch (error) {
      console.error("Error in /api/generate:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  });

  return createServer(app);
}