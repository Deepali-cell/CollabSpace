import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import StateContextProvider from "./context/stateContextProvider";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StateContextProvider>
        <App />
        <Toaster />
      </StateContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
