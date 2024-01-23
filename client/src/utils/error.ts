export function getErrorMsg(error: unknown) {
    let message: string = "";

    if (error) {
        if (error instanceof Error) {
            message = error.message;
        } else if (
            typeof error === "object" &&
            "message" in error &&
            typeof error.message === "string"
        ) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else {
            message = "Something went wrong!";
        }
    }

    return message;
}
