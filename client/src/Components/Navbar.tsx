import React from "react";
import { useUserAuth } from "../providers/UserAuthProvider";
import { Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const Navbar = (): React.ReactElement => {
    const { login, logout, isAuthenticated } = useUserAuth();

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
            className="bg-blue"
        >
            <Link to="/" className="text-2xl text-red font-bold font-norican">
                Futflare
            </Link>
            {isAuthenticated ? (
                <Button color="yellow" onClick={logout}>
                    Logout
                </Button>
            ) : (
                <Button color="yellow" onClick={login}>
                    Signin
                </Button>
            )}
        </Flex>
    );
};

export default Navbar;
