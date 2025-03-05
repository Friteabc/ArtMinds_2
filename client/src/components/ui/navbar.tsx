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
          <Link href="/">
            <a className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
              >
                ArtMinds AI
              </motion.div>
            </a>
          </Link>

          <div className="flex space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  location === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                )}>
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
