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
                <div className="grid gap-4">
                    {capsules && capsules.length > 0 ? (
                        capsules.map((capsule) => (
                            <Card
                                key={capsule._id}
                                className={`
                                    border-l-4 transition-all shadow-sm hover:shadow-md
                                    ${
                                        capsule.is_opened
                                            ? "border-l-green-500"
                                            : "border-l-amber-500"
                                    }
                                `}
                            >
                                <CardHeader className="pb-0 pt-2 px-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
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
                                            } text-xs`}
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
                                    <CardDescription className="line-clamp-1 text-xs mt-0.5">
                                        {capsule.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-3">
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Owner:
                                            </span>
                                            <span className="ml-0.5 font-medium">
                                                {capsule.creator ===
                                                getIdFromSub(user?.sub || "")
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Created:
                                            </span>
                                            <span className="ml-0.5 font-medium">
                                                {new Date(
                                                    capsule.created_at
                                                ).toLocaleString("in", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Opens:
                                            </span>
                                            <span className="ml-0.5 font-medium">
                                                {new Date(
                                                    capsule.scheduled_open_date
                                                ).toLocaleString("in", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Participants:
                                            </span>
                                            <span className="ml-0.5 font-medium">
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
                                            <div className="bg-slate-50 rounded-md text-xs">
                                                <p className="text-muted-foreground font-medium text-xs">
                                                    Participants:
                                                </p>
                                                <div className="grid grid-cols-2 gap-0.5">
                                                    {capsule.participant_emails.map(
                                                        (email) => (
                                                            <span
                                                                key={email}
                                                                className="text-slate-600 text-xs truncate"
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
                                    <CardFooter className="pt-0 pb-2 px-3 justify-end">
                                        <Link
                                            to={`/capsule/${capsule._id}`}
                                            className="w-full sm:w-auto"
                                        >
                                            <Button
                                                variant="default"
                                                className="w-full sm:w-auto gap-1 bg-green-600 hover:bg-green-700 transition-colors text-xs py-0.5 h-7"
                                            >
                                                <span>View Capsule</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card className="border-dashed border-2 p-4">
                            <div className="text-center">
                                <h3 className="text-sm font-medium mb-1">
                                    No Time Capsules Found
                                </h3>
                                <p className="text-muted-foreground mb-2 text-xs">
                                    You haven't created any time capsules yet.
                                    Start preserving your memories today!
                                </p>
                                <Link to="/create">
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs py-0.5"
                                    >
                                        Create Your First Capsule
                                    </Button>
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
