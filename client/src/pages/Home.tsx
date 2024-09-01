import React, { useCallback, useEffect } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import {
    Badge,
    Box,
    Button,
    DataList,
    Flex,
    Heading,
    Separator,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { getCapsules } from "../queries";
import { getIdFromSub } from "../utils";
import Spinner from "../components/ui/spinner";
import { Link } from "react-router-dom";

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

    console.log(capsules);

    return (
        <div className="w-[80%] m-auto mb-8">
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
                            <Box key={capsule._id} className="bg-blue-50 p-6">
                                <DataList.Root>
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
                                            Creation time
                                        </DataList.Label>
                                        <DataList.Value>
                                            {new Date(
                                                capsule.created_at
                                            ).toLocaleString("in", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label minWidth="88px">
                                            Scheduled open date
                                        </DataList.Label>
                                        <DataList.Value>
                                            {new Date(
                                                capsule.scheduled_open_date
                                            ).toLocaleString("in", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label minWidth="88px">
                                            Participants
                                        </DataList.Label>
                                        <DataList.Value>
                                            <Flex direction="column">
                                                {capsule.participant_emails
                                                    ? capsule?.participant_emails?.map(
                                                          (email) => {
                                                              return (
                                                                  <span
                                                                      key={
                                                                          email
                                                                      }
                                                                  >
                                                                      - {email}{" "}
                                                                  </span>
                                                              );
                                                          }
                                                      )
                                                    : "-"}
                                            </Flex>
                                        </DataList.Value>
                                    </DataList.Item>
                                </DataList.Root>
                                {capsule.is_opened && (
                                    <Flex
                                        className="w-full"
                                        align="end"
                                        justify="end"
                                    >
                                        <Link to={`/capsule/${capsule._id}`}>
                                            <Button
                                                className="hover:cursor-pointer"
                                                color="yellow"
                                            >
                                                View
                                            </Button>
                                        </Link>
                                    </Flex>
                                )}
                            </Box>
                        );
                    })}
                </Flex>
            )}
        </div>
    );
};

export default Home;
