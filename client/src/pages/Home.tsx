import React, { useCallback, useEffect } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getCapsules } from "../queries";
import { getIdFromSub } from "../utils";
import { Link, useNavigate } from "react-router-dom";

// Import shadcn components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Lock, Unlock, User, Calendar, Users } from "lucide-react";

const Home = (): React.ReactElement => {
    const { getAccessToken, user } = useUserAuth();
    const navigate = useNavigate();

    const printToken = useCallback(async () => {
        const token = await getAccessToken();
        console.log(token);
    }, [getAccessToken]);

    useEffect(() => {
        printToken();
    }, [printToken]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["capsules"],
        queryFn: getCapsules,
    });

    useEffect(() => {
        if (error) {
            navigate(`/error`);
        }
    }, [error, navigate]);

    const capsules = data?.data;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Your Time Capsules
                </h1>
                <p className="text-muted-foreground">
                    Preserve memories to revisit in the future
                </p>
                <Separator className="my-6" />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="w-full">
                            <CardHeader>
                                <Skeleton className="h-8 w-40" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6">
                    {capsules && capsules.length > 0 ? (
                        capsules.map((capsule) => (
                            <Card
                                key={capsule._id}
                                className={`
                                    border-l-4 transition-all shadow-md hover:shadow-lg
                                    ${
                                        capsule.is_opened
                                            ? "border-l-green-500"
                                            : "border-l-amber-500"
                                    }
                                `}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">
                                            {capsule.title}
                                        </CardTitle>
                                        <Badge
                                            variant={
                                                capsule.is_opened
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={`${
                                                capsule.is_opened
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            {capsule.is_opened ? (
                                                <span className="flex items-center gap-1">
                                                    <Unlock className="h-3 w-3" />{" "}
                                                    UNLOCKED
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <Lock className="h-3 w-3" />{" "}
                                                    LOCKED
                                                </span>
                                            )}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {capsule.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Owner:
                                            </span>
                                            <span className="ml-1 font-medium">
                                                {capsule.creator ===
                                                getIdFromSub(user?.sub || "")
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Created:
                                            </span>
                                            <span className="ml-1 font-medium">
                                                {new Date(
                                                    capsule.created_at
                                                ).toLocaleString("in", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Opens:
                                            </span>
                                            <span className="ml-1 font-medium">
                                                {new Date(
                                                    capsule.scheduled_open_date
                                                ).toLocaleString("in", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Participants:
                                            </span>
                                            <span className="ml-1 font-medium">
                                                {capsule.participant_emails
                                                    ? capsule.participant_emails
                                                          .length
                                                    : 0}
                                            </span>
                                        </div>
                                    </div>

                                    {capsule.participant_emails &&
                                        capsule.participant_emails.length >
                                            0 && (
                                            <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm">
                                                <p className="text-muted-foreground mb-1 font-medium">
                                                    Participants:
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                                    {capsule.participant_emails.map(
                                                        (email) => (
                                                            <span
                                                                key={email}
                                                                className="text-slate-600"
                                                            >
                                                                • {email}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </CardContent>

                                {capsule.is_opened && (
                                    <CardFooter className="pt-2 justify-end">
                                        <Link to={`/capsule/${capsule._id}`}>
                                            <Button variant="outline">
                                                View Capsule
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card className="border-dashed border-2 p-8">
                            <div className="text-center">
                                <h3 className="text-lg font-medium mb-2">
                                    No Time Capsules Found
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't created any time capsules yet.
                                    Start preserving your memories today!
                                </p>
                                <Link to="/create">
                                    <Button>Create Your First Capsule</Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
