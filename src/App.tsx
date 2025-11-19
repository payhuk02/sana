import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configuration optimisée de React Query avec retry logic amélioré
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - données considérées fraîches pendant 5 min
      gcTime: 1000 * 60 * 10, // 10 minutes - cache gardé 10 min après inactivité
      refetchOnWindowFocus: false, // Ne pas refetch au focus de la fenêtre
      retry: (failureCount, error) => {
        // Ne pas retry pour les erreurs 4xx (erreurs client)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry jusqu'à 3 fois pour les erreurs réseau/serveur avec backoff exponentiel
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        // Backoff exponentiel: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 10000);
      },
      // Timeout après 30 secondes
      networkMode: 'online',
    },
    mutations: {
      retry: (failureCount, error) => {
        // Ne pas retry les mutations par défaut (sauf erreurs réseau)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          // Retry uniquement pour les erreurs réseau (5xx) ou timeout
          if (status >= 500 || status === 0) {
            return failureCount < 2;
          }
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  },
});
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PrefetchProvider } from "@/components/PrefetchProvider";
import { Loader2 } from "lucide-react";

// Lazy load des pages publiques (non critiques)
const Index = lazy(() => import("./pages/Index"));
const Categories = lazy(() => import("./pages/Categories"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Legal = lazy(() => import("./pages/Legal"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Pages admin (chargées immédiatement pour meilleure UX)
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import SiteSettings from "./pages/admin/SiteSettings";
import AdminSettings from "./pages/admin/AdminSettings";

// Composant de chargement
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SiteSettingsProvider>
              <ProductsProvider>
                <CartProvider>
                  <PrefetchProvider>
                    <Routes>
                    <Route 
                      path="/" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Index />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/categories" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Categories />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/product/:id" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProductDetail />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/cart" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Cart />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Checkout />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/about" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <About />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/contact" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Contact />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/privacy" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Privacy />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/legal" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Legal />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/terms" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Terms />
                        </Suspense>
                      } 
                    />
                    
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route path="products/add" element={<ProductForm />} />
                      <Route path="products/edit/:id" element={<ProductForm />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="site-settings" element={<SiteSettings />} />
                      <Route path="admin-settings" element={<AdminSettings />} />
                    </Route>
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route 
                      path="*" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <NotFound />
                        </Suspense>
                      } 
                    />
                  </Routes>
                  </PrefetchProvider>
                </CartProvider>
              </ProductsProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
