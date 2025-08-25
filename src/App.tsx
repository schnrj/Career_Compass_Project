/**
 * App Component - Application Root with OOP Architecture
 *
 * The main application component that orchestrates the entire Career Compass application.
 * It uses the AppController for centralized state management and business logic,
 * following OOP principles for maintainable and scalable architecture.
 *
 * Architecture Features:
 * - Centralized application state management via AppController
 * - Proper separation of concerns between UI and business logic
 * - Consistent error handling and loading states
 * - Route protection and authentication management
 * - Global theme and preferences management
 */

import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import { appController, AppState } from "./controllers/AppController";
import { LoadingState, ErrorState } from "./controllers/BaseController";

/**
 * App Controller Integration Hook
 * Manages the connection between React components and AppController
 */
const useAppController = () => {
  const [appState, setAppState] = useState<AppState>(
    appController.getAppState()
  );
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    canRetry: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize the application
    const initializeApp = async () => {
      await appController.initializeApp(setLoading, setError);
      setAppState(appController.getAppState());
    };

    initializeApp();
  }, []);

  // Update app state when authentication changes
  useEffect(() => {
    const updateAppState = () => {
      setAppState(appController.getAppState());
    };

    // Listen for authentication state changes
    window.addEventListener("authStateChanged", updateAppState);

    return () => {
      window.removeEventListener("authStateChanged", updateAppState);
    };
  }, []);

  return {
    appState,
    loading,
    error,
    navigationHelper: {
      navigate,
      currentPath: location.pathname,
    },
  };
};

/**
 * Protected Route Component
 * Handles route protection based on authentication status
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { appState, navigationHelper } = useAppController();

  useEffect(() => {
    if (appState.isInitialized && !appState.isAuthenticated) {
      const isProtected = appController.isProtectedRoute(
        navigationHelper.currentPath
      );

      if (isProtected) {
        appController.handleUnauthorizedAccess(
          navigationHelper,
          navigationHelper.currentPath
        );
      }
    }
  }, [
    appState.isInitialized,
    appState.isAuthenticated,
    navigationHelper.currentPath,
  ]);

  // Show loading while app is initializing
  if (!appState.isInitialized) {
    return null;
  }

  // Allow access to protected routes only for authenticated users
  const isProtected = appController.isProtectedRoute(
    navigationHelper.currentPath
  );
  if (isProtected && !appState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

/**
 * App Layout Component
 * Manages the overall layout and routing structure
 */
const AppLayout: React.FC = () => {
  const { appState, loading, error } = useAppController();

  // Show loading screen during app initialization
  if (loading.isLoading && !appState.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">
            Career Compass
          </h2>
          <p className="text-muted-foreground">
            {loading.loadingMessage || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error screen if initialization failed
  if (error.hasError && !appState.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-destructive text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground">
            Initialization Failed
          </h2>
          <p className="text-muted-foreground">{error.errorMessage}</p>
          {error.canRetry && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

/**
 * Query Client Configuration
 * Configures React Query for data fetching and caching
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Main App Component
 * Root component that provides all necessary contexts and providers
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppLayout />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
