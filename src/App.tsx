import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import IconShowcase from "./pages/IconShowcase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes without navigation */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* App routes with navigation */}
            <Route path="/plan" element={
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              </div>
            } />
            
            <Route path="/profile" element={
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </div>
            } />
            
            <Route path="/icons" element={
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <IconShowcase />
              </div>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
