import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { signInWithGoogle, user } = useAuthContext();
  const [, setLocation] = useLocation();

  // Rediriger vers /generator si déjà connecté
  useEffect(() => {
    if (user) {
      setLocation("/generator");
    }
  }, [user, setLocation]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setLocation("/generator");
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Connectez-vous pour commencer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Continuer avec Google
          </Button>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            10 crédits offerts à l'inscription !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}