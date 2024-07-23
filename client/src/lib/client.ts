import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import enviroment from "../enviroment";
import {
    Auth0ContextInterface,
    GetTokenSilentlyOptions,
} from "@auth0/auth0-react";

export const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const apiClient = axios.create({
    baseURL: enviroment.server_url,
});

let getAccessTokenSilently:
    | ((options?: GetTokenSilentlyOptions) => Promise<string>)
    | null = null;

export const setAuth0 = (auth0Client: Auth0ContextInterface) => {
    getAccessTokenSilently = auth0Client.getAccessTokenSilently;
};

apiClient.interceptors.request.use(async (config) => {
    if (getAccessTokenSilently) {
        try {
            const token = await getAccessTokenSilently();
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Error getting access token", error);
        }
    }
    return config;
});
