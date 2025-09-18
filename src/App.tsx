import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute, { StudentRoute, AdminRoute, GuestRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/components/auth/LoginPage";
import MFAVerify from "@/components/auth/MFAVerify";
import MFASetup from "@/components/auth/MFASetup";
import StudentDashboard from "@/pages/student/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public/Guest Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes - Only accessible when not authenticated */}
            <Route path="/auth/login" element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            } />
            <Route path="/auth/mfa-verify" element={
              <GuestRoute>
                <MFAVerify />
              </GuestRoute>
            } />
            <Route path="/auth/mfa-setup" element={
              <GuestRoute>
                <MFASetup />
              </GuestRoute>
            } />
            
            {/* Protected Student Routes */}
            <Route path="/student/dashboard" element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
