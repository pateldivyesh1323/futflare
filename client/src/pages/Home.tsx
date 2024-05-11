import React, { useCallback, useEffect, useState } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Capsule } from "../types";
import axios from "axios";
import enviroment from "../enviroment";
import toast from "react-hot-toast";
import { getErrorMsg } from "../utils/error";
import { Button, Heading } from "@radix-ui/themes";

const Home = (): React.ReactElement => {
    const { getAccessToken } = useUserAuth();

    const [capsules, setCapsules] = useState<Partial<Capsule>[]>();

    const handleGetToken = async () => {
        const token = await getAccessToken();
        console.log(token);
    };

    const getCapsules = useCallback(async () => {
        try {
            const token = await getAccessToken();
            // const data = await axios.get(`${enviroment.server_url}/capsule`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json",
            //     },
            // });
            const res = await fetch(`${enviroment.server_url}/capsule`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data);
            // setCapsules(data);
        } catch (error) {
            console.log("Error : ", error);
            toast.error(getErrorMsg(error));
        }
    }, [getAccessToken]);

    useEffect(() => {
        getCapsules();
    }, [getCapsules]);

    return (
        <div className="w-[80%] m-auto">
            <Button color="sky" onClick={handleGetToken}>
                Get token
            </Button>
            <Heading size="6">Capsules</Heading>
            {capsules?.map((capsule) => {
                return <div>{capsule.title}</div>;
            })}
        </div>
    );
};

export default Home;
