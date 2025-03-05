import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, ImageIcon, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-3 rounded-full bg-primary/10 mb-4"
          >
            <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
          >
            ArtMinds AI
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Explorez les possibilités infinies de la création artistique avec notre générateur d'images alimenté par l'IA
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Link href="/generator">
              <Button size="lg" className="group">
                <Wand2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Commencer à créer
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                En savoir plus
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              {
                icon: <Wand2 className="h-8 w-8" />,
                title: "Création intuitive",
                description: "Interface simple et puissante pour donner vie à vos idées"
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: "IA avancée",
                description: "Propulsé par les derniers modèles de génération d'images"
              },
              {
                icon: <ImageIcon className="h-8 w-8" />,
                title: "Styles variés",
                description: "20 styles artistiques différents pour tous les goûts"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50"
              >
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}