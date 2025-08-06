import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
