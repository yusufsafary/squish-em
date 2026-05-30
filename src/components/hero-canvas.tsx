import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random()
    }));

    const blobs = Array.from({ length: 5 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 40 + 20,
      hue: [127, 263, 48, 360, 215][Math.floor(Math.random() * 5)]
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = "white";
      stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y -= star.speed;
        if (star.y < 0) star.y = height;
      });

      // Draw blobs
      blobs.forEach(blob => {
        ctx.globalAlpha = 0.6;
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < 0 || blob.x > width) blob.vx *= -1;
        if (blob.y < 0 || blob.y > height) blob.vy *= -1;

        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${blob.hue}, 60%, 50%)`;
        ctx.fillStyle = `hsl(${blob.hue}, 60%, 50%)`;

        ctx.beginPath();
        const time = Date.now() / 500;
        const wobble = Math.sin(time + blob.x) * 5;
        
        ctx.arc(blob.x, blob.y + wobble, blob.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
