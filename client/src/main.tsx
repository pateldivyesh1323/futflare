import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import enviroments from "./enviroment.ts";
import { UserAuthProvider } from "./providers/UserAuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "./Components/ui/sonner.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/client.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0Provider
                domain={enviroments.auth_domain}
                clientId={enviroments.auth_clientid}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                    audience: enviroments.api_identifier,
                }}
            >
                <QueryClientProvider client={queryClient}>
                    <Theme accentColor="sky">
                        <UserAuthProvider>
                            <Toaster />
                            <App />
                        </UserAuthProvider>
                    </Theme>
                </QueryClientProvider>
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode>
);
