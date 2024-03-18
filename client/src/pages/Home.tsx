import React, { useEffect, useState } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Capsule } from "../types";

const Home = (): React.ReactElement => {

    const { getAccessToken } = useUserAuth();

    const [capsules, setCapsules] = useState<Partial<Capsule>>();

    const handleGetToken = async () => {
        const token = await getAccessToken();
        console.log(token);
    }

    const getCapsules = async () => {

    }

    useEffect(() => {
        getCapsules();
    }, [])

    return (
        <div className="w-[80%] m-auto">
            <button onClick={handleGetToken}>Get token</button>
            <div className="font-semibold text-2xl">Capsules</div>
            <hr />
        </div>
    )
}

export default Home;