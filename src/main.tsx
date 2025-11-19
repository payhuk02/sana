import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { measureWebVitals, logWebVitals } from "./lib/webVitals";

// Mesurer les Web Vitals
measureWebVitals(logWebVitals);

createRoot(document.getElementById("root")!).render(<App />);
