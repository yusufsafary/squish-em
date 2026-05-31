import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import HowToPlay from "@/pages/how-to-play";
import Roadmap from "@/pages/roadmap";
import Play from "@/pages/play";
import Changelog from "@/pages/changelog";
import Tech from "@/pages/tech";
import AiAgent from "@/pages/ai-agent";
import NotFound from "@/pages/not-found";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PwaPrompt } from "@/components/pwa-prompt";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isPlayPage = location === "/play";

  if (isPlayPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Nav />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <PwaPrompt />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/how-to-play" component={HowToPlay} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/play" component={Play} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/tech" component={Tech} />
      <Route path="/ai-agent" component={AiAgent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
