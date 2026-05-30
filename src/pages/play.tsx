import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function Play() {
  useEffect(() => {
    // Prevent scrolling on the body while playing
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Slim Top Bar */}
      <div className="h-10 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="font-orbitron font-bold text-primary glow-text-green text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          SQUISH 'EM!
        </div>
        <Link 
          href="/" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Game Embed */}
      <div className="flex-1 w-full relative bg-black">
        <iframe
          data-testid="game-iframe"
          src="https://yusufsafary.github.io/squish-em/game.html"
          className="absolute inset-0 w-full h-full border-none"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title="SQUISH 'EM! Game"
        />
      </div>
    </div>
  );
}
