import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function Root() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  
  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
