import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { AdminPage, DashboardPage, HistoryPage, InterviewNewPage, InterviewPage, LoginPage, MarketingPage, ResumePage, SignupPage } from '@/pages/all-pages';
import '@/index.css';
import {
  Redirect, Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
         <Route path="/" component={MarketingPage} />
         <Route path="/login" component={LoginPage} />
         <Route path="/signup" component={SignupPage} />
         <Route path="/dashboard"><Protected><DashboardPage /></Protected></Route>
         <Route path="/interview/new"><Protected><InterviewNewPage /></Protected></Route>
         <Route path="/interview/:id"><Protected><InterviewPage /></Protected></Route>
         <Route path="/history"><Protected><HistoryPage /></Protected></Route>
         <Route path="/resume"><Protected><ResumePage /></Protected></Route>
         <Route path="/admin"><Protected><AdminPage /></Protected></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function Protected({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(localStorage.getItem('hirelens-demo-auth') === 'true');
    setReady(true);
  }, []);
  if (!ready) return <div className="route-loading" data-testid="route-loading">Loading your room…</div>;
  return authenticated ? <>{children}</> : <Redirect to="/login" />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
