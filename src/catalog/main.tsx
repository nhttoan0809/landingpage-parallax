import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Catalog from "./Catalog";
import "./base.css";

const root = document.getElementById("root");
if (!root) throw new Error("Catalog root element not found");

createRoot(root).render(
  <StrictMode>
    <Catalog />
  </StrictMode>,
);
