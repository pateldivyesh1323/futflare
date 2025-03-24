import React, { useEffect, useState } from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getCapsules } from "../queries";
import { getIdFromSub } from "../utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Lock, Unlock, User, Calendar, Users } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "use-debounce";

const Home = (): React.ReactElement => {
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [sortBy, setSortBy] = useState(
        searchParams.get("sortBy") || "latest"
    );
    const [currentPage, setCurrentPage] = useState(
        parseInt(searchParams.get("page") || "1")
    );
    const [itemsPerPage, setItemsPerPage] = useState(
        parseInt(searchParams.get("limit") || "5")
    );
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );
    const [search] = useDebounce(searchQuery, 500);

    useEffect(() => {
        const params = new URLSearchParams();
        if (sortBy !== "latest") params.set("sortBy", sortBy);
        if (currentPage !== 1) params.set("page", currentPage.toString());
        if (itemsPerPage !== 5) params.set("limit", itemsPerPage.toString());
        if (search) params.set("search", search);

        setSearchParams(params, { replace: true });
    }, [sortBy, currentPage, itemsPerPage, search, setSearchParams]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["capsules", sortBy, search, currentPage, itemsPerPage],
        queryFn: () =>
            getCapsules({
                sortBy,
                searchQuery: search,
                page: currentPage,
                limit: itemsPerPage,
            }),
    });

    useEffect(() => {
        if (error) {
            navigate(`/error`);
        }
    }, [error, navigate]);

    const capsules = data?.data?.data;
    const totalItems = data?.data?.totalCount || 0;
    const totalPages = data?.data?.totalPages || 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (value: string) => {
        const newLimit = parseInt(value);
        setItemsPerPage(newLimit);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Your Time Capsules
                </h1>
                <p className="text-muted-foreground">
                    Preserve memories to revisit in the future
                </p>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Search capsules..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                </div>

                <div className="flex items-center">
                    <Label
                        htmlFor="sortBy"
                        className="mr-2 text-xs text-slate-600"
                    >
                        Sort by:
                    </Label>
                    <Select
                        onValueChange={(value) => setSortBy(value)}
                        value={sortBy}
                    >
                        <SelectTrigger id="sortBy" className="w-[150px]">
                            <SelectValue placeholder="Select sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card
                            key={i}
                            className="border-l-4 border-l-gray-300 transition-all shadow-sm pb-4"
                        >
                            <CardHeader className="pb-0 pt-2 px-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-3/4 mt-0.5" />
                            </CardHeader>

                            <CardContent className="px-3">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-8 ml-0.5" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20 ml-0.5" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20 ml-0.5" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-8 ml-0.5" />
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-md p-2">
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <div className="grid grid-cols-2 gap-0.5">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-28" />
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="justify-end px-3">
                                <Skeleton className="h-7 w-28 rounded-md" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : capsules && capsules.length > 0 ? (
                <div className="space-y-4">
                    {capsules.map((capsule) => (
                        <Card
                            key={capsule._id}
                            className={`
                                    border-l-4 transition-all shadow-sm hover:shadow-md pb-4
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
                                    capsule.participant_emails.length > 0 && (
                                        <div className="bg-slate-50 rounded-md text-xs p-2 my-2">
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
                                <CardFooter className="justify-end">
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
                    ))}
                </div>
            ) : (
                <Card className="border-dashed border-2 p-4">
                    <div className="text-center">
                        <h3 className="text-sm font-medium mb-1">
                            No Time Capsules Found
                        </h3>
                        <p className="text-muted-foreground mb-2 text-xs">
                            You haven't created any time capsules yet. Start
                            preserving your memories today!
                        </p>
                        <Link to="/capsule/create">
                            <Button size="sm" className="h-7 text-xs py-0.5">
                                Create Your First Capsule
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}
            {capsules && capsules.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-slate-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                            of {totalItems} capsules
                        </div>

                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="itemsPerPage"
                                className="text-xs text-slate-600"
                            >
                                Show:
                            </Label>
                            <Select
                                onValueChange={handleItemsPerPageChange}
                                value={itemsPerPage.toString()}
                            >
                                <SelectTrigger
                                    id="itemsPerPage"
                                    className="w-[80px] h-8"
                                >
                                    <SelectValue placeholder="5" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPreviousPage();
                                    }}
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>

                            {Array.from({
                                length: Math.min(totalPages, 5),
                            }).map((_, i) => {
                                let pageNum = i + 1;

                                // For more than 5 pages, adjust which pages are shown
                                if (totalPages > 5) {
                                    if (currentPage > 3) {
                                        pageNum = currentPage - 3 + i;
                                    }

                                    // Ensure we don't exceed totalPages
                                    if (pageNum + 4 > totalPages && i >= 3) {
                                        pageNum = totalPages - 4 + i;
                                    }
                                }

                                // Add ellipsis if needed
                                if (totalPages > 5) {
                                    if (i === 0 && currentPage > 3) {
                                        return (
                                            <React.Fragment key={`start-${i}`}>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(1);
                                                        }}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                                {currentPage > 4 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}
                                            </React.Fragment>
                                        );
                                    }

                                    if (
                                        i === 4 &&
                                        currentPage < totalPages - 2
                                    ) {
                                        return (
                                            <React.Fragment key={`end-${i}`}>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(
                                                                totalPages
                                                            );
                                                        }}
                                                    >
                                                        {totalPages}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </React.Fragment>
                                        );
                                    }
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(pageNum);
                                            }}
                                            isActive={pageNum === currentPage}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToNextPage();
                                    }}
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default Home;
