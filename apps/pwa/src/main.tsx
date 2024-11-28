import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'

import App from "./App.tsx";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find root.");

if (import.meta.env.DEV) {
  studio.initialize()
  studio.extend(extension)
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
