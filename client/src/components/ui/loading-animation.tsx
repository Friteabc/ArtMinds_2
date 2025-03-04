import { motion } from "framer-motion";
import { Card } from "./card";
import { Sparkles } from "lucide-react";

export function LoadingAnimation() {
  return (
    <Card className="aspect-square flex items-center justify-center bg-card/30 backdrop-blur-sm border border-border/50">
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
      <div className="absolute bottom-10 text-center">
        <motion.p 
          className="text-sm text-primary/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Génération en cours...
        </motion.p>
      </div>
    </Card>
  );
}