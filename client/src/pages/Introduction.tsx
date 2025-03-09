import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "../providers/UserAuthProvider";
import {
    GiftIcon,
    Clock,
    CalendarIcon,
    Users,
    Lock,
    Unlock,
} from "lucide-react";

const Introduction = (): React.ReactElement => {
    const { login, isAuthenticated } = useUserAuth();

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 -z-10 opacity-10">
                    <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-purple-500 blur-3xl"></div>
                    <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-indigo-500 blur-3xl"></div>
                </div>

                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-10 text-center">
                        <div className="inline-block rounded-full bg-indigo-50 p-3">
                            <GiftIcon className="h-10 w-10 text-indigo-600" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                                Preserve Today, <br />
                                Discover Tomorrow
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                                Futflare is a digital time capsule that lets you
                                capture moments, memories, and media to be
                                revealed at a future date of your choosing.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                            {isAuthenticated ? (
                                <Link
                                    to="/capsule/create"
                                    className="w-full sm:w-auto"
                                >
                                    <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl text-lg">
                                        Create Your Capsule
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl text-lg"
                                    onClick={login}
                                >
                                    Get Started
                                </Button>
                            )}
                            <Link to="/home" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-white to-indigo-50 py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="rounded-full bg-indigo-100 p-3">
                                <Clock className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Schedule for the Future
                            </h3>
                            <p className="text-gray-500">
                                Set a future date when your time capsule will be
                                unlocked, allowing you to preserve memories with
                                built-in anticipation.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="rounded-full bg-purple-100 p-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Share with Loved Ones
                            </h3>
                            <p className="text-gray-500">
                                Invite friends and family to contribute their
                                own photos, videos, and messages to create a
                                truly collaborative memory vault.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="rounded-full bg-teal-100 p-3">
                                <Lock className="h-6 w-6 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Secure and Private
                            </h3>
                            <p className="text-gray-500">
                                Your memories are safely encrypted and stored,
                                remaining completely private until your chosen
                                reveal date.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                How It Works
                            </h2>
                            <p className="text-gray-500 md:text-xl">
                                Create your digital time capsule in three simple
                                steps
                            </p>
                        </div>
                    </div>
                    <div className="mt-16 grid gap-10 md:grid-cols-3">
                        <div className="group relative flex flex-col items-center">
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                                1
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all">
                                <GiftIcon className="h-10 w-10 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Create a Capsule
                                </h3>
                                <p className="text-center text-gray-500">
                                    Name your time capsule, add a description,
                                    and select when it should be opened.
                                </p>
                            </div>
                        </div>
                        <div className="group relative flex flex-col items-center">
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                                2
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all">
                                <CalendarIcon className="h-10 w-10 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Add Your Content
                                </h3>
                                <p className="text-center text-gray-500">
                                    Upload photos, videos, or write messages to
                                    your future self or loved ones.
                                </p>
                            </div>
                        </div>
                        <div className="group relative flex flex-col items-center">
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                                3
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all">
                                <Unlock className="h-10 w-10 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Wait for Reveal Day
                                </h3>
                                <p className="text-center text-gray-500">
                                    When the scheduled date arrives, your
                                    capsule unlocks, revealing all the memories
                                    inside.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-indigo-600 py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Ready to Create Your Time Capsule?
                            </h2>
                            <p className="text-indigo-100 md:text-xl">
                                Start preserving your memories for future
                                discovery. It's free to get started!
                            </p>
                        </div>
                        <div className="mx-auto flex flex-col sm:flex-row items-center gap-4 min-w-[200px] pt-4">
                            {isAuthenticated ? (
                                <Link to="/capsule/create">
                                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg">
                                        Create Your First Capsule
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg"
                                    onClick={login}
                                >
                                    Sign Up Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t bg-white py-6 md:py-8">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="flex items-center space-x-2">
                            <GiftIcon className="h-6 w-6 text-indigo-600" />
                            <span className="text-xl font-bold text-indigo-600">
                                Futflare
                            </span>
                        </div>
                        <p className="text-gray-500">
                            © 2025 Futflare. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Introduction;
