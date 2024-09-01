import React from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Avatar, Button, DropdownMenu, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const Navbar = (): React.ReactElement => {
    const { login, logout, isAuthenticated, user, isLoading } = useUserAuth();

    const navLinks = [
        {
            name: "My capsules",
            link: "/home",
        },
        {
            name: "Create new capsule",
            link: "/capsule/create",
        },
    ];

    console.log(user);

    return (
        <Flex
            as="div"
            align="center"
            justify="between"
            position="sticky"
            top="0"
            mb="2"
            height="80px"
            px="7"
            className="bg-blue shadow-lg"
        >
            <Link to="/" className="text-2xl text-red font-bold font-norican">
                Futflare
            </Link>
            <Flex justify="center" align="center" gap="3">
                {isAuthenticated ? (
                    <>
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.link}
                                    to={link.link}
                                    className="hover:underline text-sm"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <button
                                    className="IconButton"
                                    aria-label="Customise options"
                                >
                                    <Avatar
                                        radius="full"
                                        src={user?.picture}
                                        fallback={
                                            user?.given_name?.charAt(0) || ""
                                        }
                                        size="3"
                                        variant="solid"
                                        color="yellow"
                                    />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item onClick={logout} color="red">
                                    Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </>
                ) : (
                    <Button color="yellow" onClick={login} loading={isLoading}>
                        Signin
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default Navbar;
