import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuthContext();
  const menuRef = useRef(null);

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

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 overflow-hidden rounded-full">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "Avatar"}
                        className="h-8 w-8 object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {user.credits !== undefined && (
                        <p className="text-xs font-medium text-primary">Crédits : {user.credits}</p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <span className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent ref={menuRef} side="right" className="w-[80vw] sm:w-[350px]">
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
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  {user && (
                    <>
                      <div className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          {user.photoURL && (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || "Avatar"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            {user.credits !== undefined && (
                              <p className="text-xs font-medium text-primary">Crédits : {user.credits}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href="/profile">
                        <span className="block px-4 py-2 rounded-md text-sm transition-colors cursor-pointer hover:bg-primary/5 text-muted-foreground hover:text-primary">
                          Profil
                        </span>
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="block w-full text-left px-4 py-2 rounded-md text-sm transition-colors cursor-pointer hover:bg-primary/5 text-muted-foreground hover:text-primary"
                      >
                        Déconnexion
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}