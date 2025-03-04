import { motion } from "framer-motion";
import { Download, Camera, Sparkles } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface ImageContainerProps {
  imageUrl: string;
  seed: number;
  prompt: string;
}

export function ImageContainer({ imageUrl, seed, prompt }: ImageContainerProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-generated-${seed}.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="relative group"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50">
        <div className="relative">
          {/* Effet de lumière */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

          <img 
            src={imageUrl} 
            alt={prompt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay avec le prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <p className="text-sm text-white/90 line-clamp-2">
              {prompt}
            </p>
          </motion.div>
        </div>

        <div className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Seed: {seed}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="group">
            <Download className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-1" />
            Télécharger
          </Button>
        </div>
      </Card>

      {/* Particules d'effet de lumière */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ zIndex: -1 }}
      />
    </motion.div>
  );
}