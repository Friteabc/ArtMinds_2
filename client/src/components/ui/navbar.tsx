import { useState, useRef, useEffect } from "react"; // Added useRef and useEffect
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Added useRef hook

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/generator", label: "Générateur" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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

          {/* Navigation desktop */}
          <div className="hidden md:flex space-x-4">
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

          {/* Menu mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent ref={menuRef} side="right" className="w-[80vw] sm:w-[350px]"> {/* Added ref */}
                <nav className="flex flex-col gap-4">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={cn(
                          "block px-4 py-2 rounded-md text-sm transition-colors cursor-pointer",
                          location === link.href
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}