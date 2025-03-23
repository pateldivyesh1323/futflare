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
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Introduction = (): React.ReactElement => {
    const { login, isAuthenticated } = useUserAuth();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-hidden">
            <section className="relative overflow-hidden py-30 md:py-26">
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-pulse"
                        style={{
                            transform: `translate(${scrollY * 0.05}px, ${
                                scrollY * -0.05
                            }px)`,
                            animationDuration: "8s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl animate-pulse"
                        style={{
                            transform: `translate(${scrollY * -0.03}px, ${
                                scrollY * 0.03
                            }px)`,
                            animationDuration: "10s",
                            animationDelay: "1s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl animate-pulse"
                        style={{
                            transform: `translate(${scrollY * 0.02}px, ${
                                scrollY * 0.04
                            }px)`,
                            animationDuration: "12s",
                            animationDelay: "2s",
                        }}
                    ></div>
                </div>

                <div className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col items-center space-y-12 text-center"
                    >
                        <div className="inline-block rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-md">
                            <GiftIcon className="h-12 w-12 text-indigo-600" />
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                Preserve Today, <br />
                                <span className="relative">
                                    Discover Tomorrow
                                    <span className="absolute -right-12 -top-1">
                                        <Sparkles className="h-8 w-8 text-amber-400 opacity-70" />
                                    </span>
                                </span>
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl font-light leading-relaxed">
                                Futflare is a digital time capsule that lets you
                                capture moments, memories, and media to be
                                revealed at a future date of your choosing.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-5 min-w-[200px]"
                        >
                            {isAuthenticated ? (
                                <Link
                                    to="/capsule/create"
                                    className="w-full sm:w-auto group"
                                >
                                    <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-lg shadow-md shadow-indigo-200 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-300">
                                        <GiftIcon className="h-5 w-5 mr-2" />{" "}
                                        Create Your Capsule
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-lg shadow-md shadow-indigo-200 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-300"
                                    onClick={login}
                                >
                                    <Sparkles className="h-5 w-5 mr-2" /> Get
                                    Started
                                </Button>
                            )}
                            <Link to="/home" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg transition-all duration-300"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-white to-indigo-50 py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-30">
                    <div className="absolute h-72 w-full bg-grid-pattern-indigo/10"></div>
                </div>

                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center space-y-5 text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 shadow-inner">
                                <Clock className="h-7 w-7 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Schedule for the Future
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Set a future date when your time capsule will be
                                unlocked, allowing you to preserve memories with
                                built-in anticipation.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center space-y-5 text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="rounded-full bg-gradient-to-br from-purple-100 to-purple-200 p-4 shadow-inner">
                                <Users className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Share with Loved Ones
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Invite friends and family to contribute their
                                own photos, videos, and messages to create a
                                truly collaborative memory vault.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center space-y-5 text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="rounded-full bg-gradient-to-br from-teal-100 to-teal-200 p-4 shadow-inner">
                                <Lock className="h-7 w-7 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                Secure and Private
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Your memories are safely encrypted and stored,
                                remaining completely private until your chosen
                                reveal date.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-28 relative">
                <div className="absolute inset-0 bg-pattern-dot opacity-5 -z-10"></div>

                <div className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
                    >
                        <div className="inline-block rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-teal-100 p-2">
                            <div className="bg-white rounded-full p-2">
                                <CalendarIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                How It Works
                            </h2>
                            <p className="text-gray-600 md:text-xl max-w-2xl mx-auto">
                                Create your digital time capsule in three simple
                                steps
                            </p>
                        </div>
                    </motion.div>

                    <div className="mt-16 grid gap-10 md:grid-cols-3 relative">
                        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent hidden md:block"></div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="group relative flex flex-col items-center"
                        >
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-bold text-white shadow-lg z-10">
                                1
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-5 rounded-2xl border border-indigo-100 bg-white p-8 shadow-md transition-all group-hover:border-indigo-200">
                                <GiftIcon className="h-12 w-12 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Create a Capsule
                                </h3>
                                <p className="text-center text-gray-600">
                                    Name your time capsule, add a description,
                                    and select when it should be opened.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="group relative flex flex-col items-center"
                        >
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-bold text-white shadow-lg z-10">
                                2
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-5 rounded-2xl border border-indigo-100 bg-white p-8 shadow-md transition-all group-hover:border-indigo-200">
                                <CalendarIcon className="h-12 w-12 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Add Your Content
                                </h3>
                                <p className="text-center text-gray-600">
                                    Upload photos, videos, or write messages to
                                    your future self or loved ones.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="group relative flex flex-col items-center"
                        >
                            <span className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-bold text-white shadow-lg z-10">
                                3
                            </span>
                            <div className="mt-8 flex flex-col items-center space-y-5 rounded-2xl border border-indigo-100 bg-white p-8 shadow-md transition-all group-hover:border-indigo-200">
                                <Unlock className="h-12 w-12 text-indigo-600" />
                                <h3 className="text-xl font-bold">
                                    Wait for Reveal Day
                                </h3>
                                <p className="text-center text-gray-600">
                                    When the scheduled date arrives, your
                                    capsule unlocks, revealing all the memories
                                    inside.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-20">
                    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-400 blur-3xl"></div>
                    <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-indigo-400 blur-3xl"></div>
                </div>

                <div className="container px-4 md:px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center space-y-6 text-center text-white"
                    >
                        <Sparkles className="h-10 w-10 text-indigo-200 mb-2" />
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl drop-shadow-md">
                                Ready to Create Your Time Capsule?
                            </h2>
                            <p className="text-indigo-100 md:text-xl max-w-2xl mx-auto">
                                Start preserving your memories for future
                                discovery. It's free to get started!
                            </p>
                        </div>
                        <div className="mx-auto flex flex-col sm:flex-row items-center gap-5 min-w-[200px] pt-6">
                            {isAuthenticated ? (
                                <Link to="/capsule/create">
                                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg shadow-lg shadow-indigo-700/30 transition-all duration-300 hover:scale-105">
                                        <GiftIcon className="h-5 w-5 mr-2" />{" "}
                                        Create Your First Capsule
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl text-lg shadow-lg shadow-indigo-700/30 transition-all duration-300 hover:scale-105"
                                    onClick={login}
                                >
                                    <Sparkles className="h-5 w-5 mr-2" /> Sign
                                    Up Now
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="border-t bg-white py-8 md:py-10">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-5 text-center">
                        <div className="flex items-center space-x-3">
                            <GiftIcon className="h-7 w-7 text-indigo-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
