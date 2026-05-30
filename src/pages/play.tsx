import { Link } from "wouter";

export default function Play() {
  return (
    <div className="w-screen h-[100dvh] bg-black overflow-hidden relative">
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full font-mono text-sm border border-white/10 backdrop-blur-md transition-all flex items-center gap-2 hover:border-primary"
        data-testid="play-exit-btn"
      >
        <span>←</span> EXIT
      </Link>
      <iframe 
        src="/game.html"
        className="w-full h-full border-none"
        title="SQUISH 'EM! Game"
        allow="autoplay"
      />
    </div>
  );
}
