import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TextChat from "@/pages/TextChat";
import VideoChat from "@/pages/VideoChat";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import HowItWorks from "@/pages/HowItWorks";
import About from "@/pages/About";
import Features from "@/pages/Features";
import CommunityGuidelines from "@/pages/CommunityGuidelines";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { OnlineUsersProvider } from "@/contexts/OnlineUsersContext";

function Router() {
  const [location] = useLocation();
  const hideFooterRoutes = ["/chat", "/video"];
  const hideFooter = hideFooterRoutes.some((route) =>
    location.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <AppHeader />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat" component={TextChat} />
          <Route path="/video" component={VideoChat} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/community-guidelines" component={CommunityGuidelines} />
          <Route component={NotFound} />
        </Switch>
      </main>

      {!hideFooter && <AppFooter />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OnlineUsersProvider>
          <Toaster />
          <Router />
        </OnlineUsersProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
