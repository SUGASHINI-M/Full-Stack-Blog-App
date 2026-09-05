import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import { AuthContexProvider } from "./context/authContext";

// Send and receive cookies (required for login auth cookie)
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContexProvider>
      <App />
    </AuthContexProvider>
  </React.StrictMode>
);
