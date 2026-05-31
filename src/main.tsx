import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// SPA redirect: GitHub Pages / Vercel 404.html encodes path as ?p=
// Restore it before React mounts so the router sees the right URL
(function () {
  const p = new URLSearchParams(window.location.search).get("p");
  if (p) {
    window.history.replaceState(null, "", p + (window.location.hash || ""));
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
