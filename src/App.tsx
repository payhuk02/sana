import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import SiteSettings from "./pages/admin/SiteSettings";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SiteSettingsProvider>
            <ProductsProvider>
              <CartProvider>
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
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
              <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </ProductsProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
