import { ReactNode } from "react";
import { useLocation, useLocation as redirect } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuthContext();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/login");
    return null;
  }

  return <>{children}</>;
}
