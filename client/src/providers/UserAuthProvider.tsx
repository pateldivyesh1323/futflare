/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User, useAuth0 } from "@auth0/auth0-react";
import { getErrorMsg } from "../utils/error";
import { useNavigate } from "react-router-dom";

interface UserAuthContextInterface {
    user?: User;
    error?: string;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string>;
}

type PropsType = {
    children: ReactNode
}

const UserAuthContext = createContext<UserAuthContextInterface | null>(null);

export const UserAuthProvider: FC<PropsType> = ({ children }) => {

    const { loginWithPopup, logout, isAuthenticated, isLoading, error: auth0Error, getAccessTokenSilently, user } = useAuth0();
    const navigate = useNavigate();

    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (auth0Error?.message) {
            setError(auth0Error.message);
        }
    }, [auth0Error]);

    const login = async () => {
        try {
            await loginWithPopup();
            navigate('/home');
        } catch (error: unknown) {
            setError(getErrorMsg(error));
        }
    }

    const value: UserAuthContextInterface = {
        logout,
        login,
        getAccessToken: getAccessTokenSilently,
        isAuthenticated: isAuthenticated,
        isLoading,
        error,
        user,
    };

    return (
        <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
    )
}

export function useUserAuth() {
    const context = useContext(UserAuthContext);

    if (!context) {
        throw new Error(
            "useUserAuth must be used within a UserAuthProvider",
        );
    }

    return context;
}