import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto bg-background/80 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          Créé avec <Heart className="w-4 h-4 text-primary animate-pulse" /> par ArtMinds AI
        </div>
        <div className="mt-2">
          © {new Date().getFullYear()} ArtMinds AI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
