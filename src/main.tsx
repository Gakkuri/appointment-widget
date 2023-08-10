import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./css/global.css";

ReactDOM.createRoot(document.getElementById("widget")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
