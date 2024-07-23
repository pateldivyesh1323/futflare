import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Introduction from "./pages/Introduction";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { setAuth0 } from "./lib";

function App() {
    const auth0 = useAuth0();

    useEffect(() => {
        setAuth0(auth0);
    }, [auth0]);

    return (
        <main>
            <Navbar />
            <Routes>
                <Route path="/" element={<Introduction />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </main>
    );
}

export default App;
