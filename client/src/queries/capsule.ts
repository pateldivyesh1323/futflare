import { apiClient } from "../lib";
import { CapsuleWithoutContent } from "../types";

export const getCapsules = async () => {
    const { data } = await apiClient.get<CapsuleWithoutContent[]>(
        "/api/capsule"
    );
    return data;
};
