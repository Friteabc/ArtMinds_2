import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Image as ImageIcon, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout } = useAuthContext();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-8 px-4 md:pt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user?.photoURL && (
                  <motion.img
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={user.photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                )}
                <div>
                  <CardTitle className="text-2xl">{user?.displayName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Crédits disponibles</h3>
                      <p className="text-2xl font-bold">{user?.credits || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Images générées</h3>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Mes créations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Les images seront affichées ici */}
          </div>
        </div>
      </div>
    </div>
  );
}
