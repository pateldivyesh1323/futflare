import { Navigate } from "react-router-dom";
import { useUserAuth } from "../providers/UserAuthProvider";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useUserAuth();
    if (!isAuthenticated && !isLoading) {
        return <Navigate to="/" replace />
    }
    return children;
}

export default PrivateRoute;