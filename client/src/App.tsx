import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Introduction from "./pages/Introduction";
import PrivateRoute from "./Components/PrivateRoute";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { setAuth0 } from "./lib";
import CreateCapsule from "./pages/CreateCapsule";
import OpenedCapsule from "./pages/OpenedCapsule";
import Error from "./pages/Error";

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
                <Route
                    path="/capsule/create"
                    element={
                        <PrivateRoute>
                            <CreateCapsule />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/capsule/:id"
                    element={
                        <PrivateRoute>
                            <OpenedCapsule />
                        </PrivateRoute>
                    }
                />
                <Route path="/error" element={<Error />} />
            </Routes>
        </main>
    );
}

export default App;
