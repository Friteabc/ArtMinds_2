import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/ui/private-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generator from "@/pages/generator";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import About from "@/pages/about";
import Contact from "@/pages/contact";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/generator">
        <PrivateRoute>
          <Generator />
        </PrivateRoute>
      </Route>
      <Route path="/profile">
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      </Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;