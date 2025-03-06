import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateImageSchema, type GenerateImageInput, imageStyles, defaultNegativePrompt } from "@shared/schema";
import { Wand2, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageContainer } from "@/components/ui/image-container";
import { LoadingAnimation } from "@/components/ui/loading-animation";

const aspectRatios = {
  square: { width: 1024, height: 1024 },
  landscape: { width: 1280, height: 768 },
  portrait: { width: 768, height: 1280 }
};

export default function Generator() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const imageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const form = useForm<GenerateImageInput>({
    resolver: zodResolver(generateImageSchema),
    defaultValues: {
      prompt: "",
      negativePrompt: defaultNegativePrompt,
      aspectRatio: "square",
      style: "realistic"
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateImageInput) => {
      if (!user) {
        throw new Error("Veuillez vous connecter pour générer une image");
      }

      console.log("Tentative de génération d'image avec l'utilisateur:", {
        userId: user.id,
        credits: user.credits
      });

      const dimensions = aspectRatios[data.aspectRatio];
      const res = await apiRequest("POST", "/api/generate", {
        ...data,
        width: dimensions.width,
        height: dimensions.height,
        userId: user.id,
        debug: true // Ajouter un flag de debug
      });

      const jsonResponse = await res.json();
      console.log("Réponse de l'API generate:", jsonResponse);
      return jsonResponse;
    },
    onSuccess: (data, variables) => {
      setGeneratedImage(data.imageUrl);
      setSeed(data.seed);
      setLastPrompt(variables.prompt);
      toast({
        title: "Image générée avec succès !",
        description: `Seed: ${data.seed} - Crédits restants : ${data.remainingCredits}`,
      });
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la génération:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  });

  useEffect(() => {
    if (generatedImage && imageRef.current) {
      imageRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "center"
      });
    }
  }, [generatedImage]);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    console.log("État d'authentification:", {
      isAuthenticated: !!user,
      userId: user?.id,
      credits: user?.credits
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-8 px-4 md:pt-24">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-2 rounded-full bg-primary/10 mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Générateur d'Images
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Créez des images époustouflantes dans le style qui vous inspire
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))} 
                className="space-y-6 backdrop-blur-sm bg-card/30 p-4 md:p-6 rounded-lg border border-border/50">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de l'image</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Un paysage futuriste avec des villes flottantes..."
                      className="h-24 bg-background/50"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style artistique</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Choisissez un style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imageStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style.split("-").map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="negativePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Éléments à éviter</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="flou, mauvaise qualité, déformé..."
                      className="bg-background/50"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aspectRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format de l'image</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="square" id="square" />
                        <label htmlFor="square" className="text-sm">Carré</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <label htmlFor="landscape" className="text-sm">Paysage</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="portrait" />
                        <label htmlFor="portrait" className="text-sm">Portrait</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full group"
              disabled={generateMutation.isPending}
            >
              <motion.div
                animate={{ rotate: generateMutation.isPending ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Wand2 className="h-4 w-4" />
              </motion.div>
              {generateMutation.isPending ? "Génération en cours..." : "Générer l'image"}
            </Button>
          </form>
        </Form>
      </div>

      <AnimatePresence>
        {(generateMutation.isPending || generatedImage) && (
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto w-full mt-8 p-4 md:p-6"
          >
            {generateMutation.isPending ? (
              <LoadingAnimation />
            ) : generatedImage ? (
              <ImageContainer 
                imageUrl={generatedImage} 
                seed={seed!} 
                prompt={lastPrompt}
              />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}