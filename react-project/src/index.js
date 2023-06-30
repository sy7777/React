import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';
// create element
const root = createRoot(document.querySelector("#root"));

root.render(<App />)
