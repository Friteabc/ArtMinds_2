import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/generator", label: "Générateur" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent cursor-pointer">
                ArtMinds AI
              </span>
            </Link>
          </motion.div>

          <div className="flex space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                  location === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}