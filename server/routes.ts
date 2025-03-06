import type { Express } from "express";
import { createServer } from "http";
import { generateImageSchema, aspectRatios, defaultNegativePrompt } from "@shared/schema";
import { ZodError } from "zod";
import { storage } from "./storage";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_KEY = process.env.HF_API_KEY;

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/google/callback`
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

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
  // Route pour l'autorisation Google Drive
  app.get("/api/google/authorize", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file']
    });
    res.json({ url: authUrl });
  });

  // Callback pour Google Drive
  app.get("/api/google/callback", async (req, res) => {
    try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      // Créer un dossier pour l'utilisateur
      const folderResponse = await drive.files.create({
        requestBody: {
          name: 'ArtMinds AI Generated Images',
          mimeType: 'application/vnd.google-apps.folder'
        }
      });

      // Mettre à jour les informations de l'utilisateur
      if (req.user?.id) {
        await storage.updateUserDriveInfo(
          req.user.id,
          tokens.access_token!,
          folderResponse.data.id!
        );
      }

      res.redirect('/profile');
    } catch (error) {
      console.error('Google Drive callback error:', error);
      res.redirect('/profile?error=drive_connection_failed');
    }
  });

  // Route pour créer ou mettre à jour un utilisateur
  app.post("/api/users", async (req, res) => {
    try {
      const { id, email } = req.body;

      if (!id || !email) {
        throw new Error("ID et email requis");
      }

      let user = await storage.getUser(id);

      if (!user) {
        user = await storage.createUser({ id, email });
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
      const input = generateImageSchema.parse(req.body);
      const { userId } = req.body;

      if (!userId) {
        throw new Error("Utilisateur non authentifié");
      }

      // Vérifier les crédits de l'utilisateur
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      if (user.credits < 3.5) {
        throw new Error("Crédits insuffisants pour générer une image");
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

      // Sauvegarder dans Google Drive si connecté
      if (user.driveConnected && user.driveToken && user.driveFolderId) {
        try {
          oauth2Client.setCredentials({ access_token: user.driveToken });

          // Convertir l'image base64 en Buffer
          const imageBuffer = Buffer.from(base64Image, 'base64');

          // Créer le fichier dans Google Drive
          await drive.files.create({
            requestBody: {
              name: `ArtMinds_${Date.now()}.png`,
              parents: [user.driveFolderId],
              description: `Prompt: ${input.prompt}\nStyle: ${input.style}\nSeed: ${payload.parameters.seed}`
            },
            media: {
              mimeType: 'image/png',
              body: imageBuffer
            }
          });
        } catch (error) {
          console.error("Google Drive upload error:", error);
          // Continue même si l'upload échoue
        }
      }

      // Après la génération réussie, déduire les crédits
      const updatedUser = await storage.updateUserCredits(userId, user.credits - 3.5);

      res.json({ 
        imageUrl: `data:image/png;base64,${base64Image}`,
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