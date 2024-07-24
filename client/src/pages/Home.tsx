import React, { useCallback, useEffect } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import {
    Badge,
    DataList,
    Flex,
    Heading,
    Separator,
    Spinner,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { getCapsules } from "../queries";
import { getIdFromSub } from "../utils";

const Home = (): React.ReactElement => {
    const { getAccessToken } = useUserAuth();
    const { user } = useUserAuth();

    const printToken = useCallback(async () => {
        const token = await getAccessToken();
        console.log(token);
    }, [getAccessToken]);

    useEffect(() => {
        printToken();
    }, [printToken]);

    const { data: capsules, isLoading } = useQuery({
        queryKey: ["capsules"],
        queryFn: getCapsules,
    });

    return (
        <div className="w-[80%] m-auto">
            <Heading size="6" mb="2">
                Your Capsules
            </Heading>
            <Separator orientation="horizontal" size="4" color="cyan" mb="4" />
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex direction="column" gap="6">
                    {capsules?.map((capsule) => {
                        return (
                            <DataList.Root
                                key={capsule._id}
                                className="bg-blue-50 p-6"
                            >
                                <DataList.Item align="center">
                                    <DataList.Label minWidth="88px">
                                        Status
                                    </DataList.Label>
                                    <DataList.Value>
                                        <Badge
                                            color={
                                                capsule.is_opened
                                                    ? "green"
                                                    : "red"
                                            }
                                            variant="soft"
                                            radius="full"
                                        >
                                            {capsule.is_opened
                                                ? "UNLOCKED"
                                                : "LOCKED"}
                                        </Badge>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label minWidth="88px">
                                        Title
                                    </DataList.Label>
                                    <DataList.Value>
                                        {capsule.title}
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label minWidth="88px">
                                        Description
                                    </DataList.Label>
                                    <DataList.Value>
                                        {capsule.description}
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label minWidth="88px">
                                        Owner
                                    </DataList.Label>
                                    <DataList.Value>
                                        {capsule.creator ===
                                        getIdFromSub(user?.sub || "")
                                            ? "Yes"
                                            : "No"}
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label minWidth="88px">
                                        Participants
                                    </DataList.Label>
                                    <DataList.Value>
                                        {capsule.participants_email
                                            ? capsule?.participants_email?.map(
                                                  (email) => {
                                                      return (
                                                          <span key={email}>
                                                              {email}{" "}
                                                          </span>
                                                      );
                                                  }
                                              )
                                            : "-"}
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        );
                    })}
                </Flex>
            )}
        </div>
    );
};

export default Home;
