import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import './i18n';
import AppWrapper from "./AppWrapper.jsx";




createRoot(document.getElementById('root')).render(<StrictMode >
<BrowserRouter>
<AuthProvider>
  <AppWrapper>
    <App />
  </AppWrapper>
</AuthProvider>
</BrowserRouter>
</StrictMode>
)