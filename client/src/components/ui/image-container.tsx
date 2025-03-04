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
    link.download = `artminds-${seed}.png`;
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
          {/* Effets de lumière avancés */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute inset-0 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_50%)] group-hover:opacity-75 transition-opacity duration-500" />

          {/* Points lumineux animés */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial="hidden"
            animate="visible"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/50 rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 1, 0.5],
                  x: ["0%", "100%", "0%"],
                  y: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 5,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 25}%`
                }}
              />
            ))}
          </motion.div>

          <img 
            src={imageUrl} 
            alt={prompt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay avec le prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4"
          >
            <p className="text-sm text-white/90 line-clamp-2 font-medium">
              {prompt}
            </p>
          </motion.div>
        </div>

        <div className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-t border-border/10">
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4 text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Seed: {seed}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            className="group hover:bg-primary/10"
          >
            <Download className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-1" />
            Télécharger
          </Button>
        </div>
      </Card>

      {/* Effet de halo */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{ zIndex: -1 }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}