import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateImageSchema, type GenerateImageInput } from "@shared/schema";
import { Wand2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageContainer } from "@/components/ui/image-container";
import { LoadingAnimation } from "@/components/ui/loading-animation";

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateImageInput>({
    resolver: zodResolver(generateImageSchema),
    defaultValues: {
      prompt: "",
      negativePrompt: "",
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateImageInput) => {
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl);
      setSeed(data.seed);
      toast({
        title: "Image generated successfully!",
        description: `Seed: ${data.seed}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  });

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <h1 className="text-4xl font-bold text-primary mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground">Generate stunning images with AI</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))} className="space-y-6 mt-8">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A futuristic city with flying cars..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="negativePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negative Prompt</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="blurry, low quality, distorted..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={generateMutation.isPending}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {generateMutation.isPending ? "Generating..." : "Generate Image"}
            </Button>
          </form>
        </Form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto w-full"
      >
        {generateMutation.isPending ? (
          <LoadingAnimation />
        ) : generatedImage ? (
          <ImageContainer imageUrl={generatedImage} seed={seed!} />
        ) : null}
      </motion.div>
    </div>
  );
}
