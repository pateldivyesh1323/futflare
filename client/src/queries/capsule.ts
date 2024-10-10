import { apiClient } from "../lib";
import { CapsuleWithoutContent, APIResponseType } from "../types";

export const getCapsules = async () => {
    const { data } = await apiClient.get<
        APIResponseType<CapsuleWithoutContent[]>
    >("/api/capsule");
    return data;
};

export const createCapsule = async () => {
    const { data } = await apiClient.post<
        APIResponseType<CapsuleWithoutContent>
    >("/api/capsule");
    return data;
};
