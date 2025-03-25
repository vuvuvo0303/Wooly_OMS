import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import SplashCursor from "./components/SplashCursor.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Sonner />
      <ToastContainer />
      <SplashCursor />

    </BrowserRouter>
  </StrictMode>
);
