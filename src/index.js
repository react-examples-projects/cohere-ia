import React from "react";
import ReactDOM from "react-dom/client";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import App from "./App";

import "inter-ui/inter.css";
import "normalize.css";
import "./styles/index.scss";
import "./styles/utils.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GeistProvider themeType="dark">
      <CssBaseline />
      <App />
    </GeistProvider>
  </React.StrictMode>
);
  