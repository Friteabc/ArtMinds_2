import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface ImageContainerProps {
  imageUrl: string;
  seed: number;
}

export function ImageContainer({ imageUrl, seed }: ImageContainerProps) {
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
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <img 
            src={imageUrl} 
            alt="Generated image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex items-center justify-between bg-card">
          <p className="text-sm text-muted-foreground">Seed: {seed}</p>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
