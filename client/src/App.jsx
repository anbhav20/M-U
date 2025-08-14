import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TextChat from "@/pages/TextChat";
import VideoChat from "@/pages/VideoChat";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter.jsx";
import { OnlineUsersProvider } from "@/contexts/OnlineUsersContext";

function Router() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <AppHeader />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat" component={TextChat} />
          <Route path="/video" component={VideoChat} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <AppFooter />
    </div>
  );
}

function App() {
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

export default App;