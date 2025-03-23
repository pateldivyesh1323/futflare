import React from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiftIcon, LogOut, Settings, User } from "lucide-react";

const Navbar = (): React.ReactElement => {
    const { login, logout, isAuthenticated, user, isLoading } = useUserAuth();
    const location = useLocation();

    const navLinks = [
        {
            name: "My Capsules",
            link: "/home",
        },
        {
            name: "Create Capsule",
            link: "/capsule/create",
        },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold text-indigo-600"
                >
                    <GiftIcon className="h-6 w-6" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Futflare
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <nav className="hidden space-x-4 md:flex">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.link}
                                        to={link.link}
                                        className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                                            isActive(link.link)
                                                ? "bg-slate-100 text-indigo-600"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button
                                        variant="ghost"
                                        className="rounded-full h-8 w-8 p-0"
                                    >
                                        <Avatar className="h-8 w-8 ring-2 ring-indigo-100">
                                            <AvatarImage
                                                src={user?.picture}
                                                alt={user?.name || "User"}
                                            />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {user?.given_name?.charAt(0) ||
                                                    user?.name?.charAt(0) ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-slate-500">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-rose-500 focus:text-rose-500"
                                        onClick={logout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <line x1="4" x2="20" y1="12" y2="12" />
                                    <line x1="4" x2="20" y1="6" y2="6" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                </svg>
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={login}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
