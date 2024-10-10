import { isAxiosError } from "axios";
import { toast } from "sonner";

const getErrorMessage = (error: unknown) => {
    let message: string = "";

    if (error) {
        if (isAxiosError(error)) {
            message = error.response?.data.message || "Something went wrong!";
        } else if (error instanceof Error) {
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
};

const handleError = (error: unknown) => {
    toast.error(getErrorMessage(error));
};

export { getErrorMessage, handleError };
