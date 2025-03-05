import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SiReplit, SiReact, SiTypescript, SiTailwindcss, SiHuggingface } from "react-icons/si";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-24">
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            À propos d'ArtMinds AI
          </h1>
          <p className="text-muted-foreground">
            Découvrez l'histoire derrière notre générateur d'images IA et les technologies qui le propulsent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 backdrop-blur-sm bg-card/30 border-border/50">
            <h2 className="text-2xl font-semibold mb-4">Technologies utilisées</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SiHuggingface className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-medium">Stable Diffusion XL</h3>
                  <p className="text-sm text-muted-foreground">Modèle de génération d'images de pointe</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SiReact className="w-6 h-6 text-[#61DAFB]" />
                <div>
                  <h3 className="font-medium">React</h3>
                  <p className="text-sm text-muted-foreground">Framework frontend moderne et réactif</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SiTypescript className="w-6 h-6 text-[#3178C6]" />
                <div>
                  <h3 className="font-medium">TypeScript</h3>
                  <p className="text-sm text-muted-foreground">Pour un code robuste et typé</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SiTailwindcss className="w-6 h-6 text-[#06B6D4]" />
                <div>
                  <h3 className="font-medium">Tailwind CSS</h3>
                  <p className="text-sm text-muted-foreground">Design moderne et responsive</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-card/30 border-border/50">
            <h2 className="text-2xl font-semibold mb-4">Le développeur</h2>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-2 ring-primary/20">
                <img 
                  src="https://i.postimg.cc/DZJY70XQ/In-Shot-20250219-222006478.jpg" 
                  alt="Friteabc"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Friteabc</h3>
              <p className="text-muted-foreground mt-2">
                Passionné par l'IA et le développement web, créateur d'ArtMinds AI
              </p>
              <div className="flex items-center gap-2 mt-4">
                <SiReplit className="w-5 h-5" />
                <span className="text-sm text-muted-foreground">Développé sur Replit</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-card/30 border-border/50 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Fonctionnalités</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>• 20 styles artistiques différents</li>
            <li>• Formats d'image variés (carré, paysage, portrait)</li>
            <li>• Génération d'images haute qualité</li>
            <li>• Interface utilisateur intuitive et moderne</li>
            <li>• Animations fluides et effets visuels</li>
            <li>• Téléchargement des images générées</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
