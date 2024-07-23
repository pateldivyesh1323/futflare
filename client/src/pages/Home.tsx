import React from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Button, Heading, Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { getCapsules } from "../queries";

const Home = (): React.ReactElement => {
    const { getAccessToken } = useUserAuth();

    const handleGetToken = async () => {
        const token = await getAccessToken();
        console.log(token);
    };

    const { data: capsules, isLoading } = useQuery({
        queryKey: ["capsules"],
        queryFn: getCapsules,
    });

    console.log(capsules);

    return (
        <div className="w-[80%] m-auto">
            <Button color="sky" onClick={handleGetToken}>
                Get token
            </Button>
            <Heading size="6">Capsules</Heading>
            {isLoading ? (
                <Spinner />
            ) : (
                capsules?.map((capsule) => {
                    return <div key={capsule._id}>{capsule.title}</div>;
                })
            )}
        </div>
    );
};

export default Home;
