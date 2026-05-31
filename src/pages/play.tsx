import { useEffect } from "react";

export default function Play() {
  useEffect(() => {
    window.location.replace("/game.html");
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-[100dvh] bg-[#0d0d1a]">
      <div className="text-center">
        <p className="text-green-400 font-mono text-sm tracking-widest uppercase mb-4">Loading Game</p>
        <div className="flex gap-2 justify-center">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
}
