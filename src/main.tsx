import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/recursive/full.css";
import App from "./App";
import "./styles.css";

// Hold the opening until the typeface is in, so nothing redraws mid-entrance.
const root = document.documentElement;
const ready = () => root.classList.add("ready");
void document.fonts.load('900 1em "Recursive Variable"').then(ready, ready);
window.setTimeout(ready, 1800);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
