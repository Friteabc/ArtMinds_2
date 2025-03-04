import { motion } from "framer-motion";
import { Card } from "./card";

export function LoadingAnimation() {
  return (
    <Card className="aspect-square flex items-center justify-center bg-card/50">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </Card>
  );
}
