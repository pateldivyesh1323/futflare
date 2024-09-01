import { apiClient } from "../lib";
import { APIResponseType, CapsuleWithoutContent } from "../types";

export const getCapsules = async () => {
    const { data } = await apiClient.get<
        APIResponseType<CapsuleWithoutContent[]>
    >("/api/capsule");
    return data;
};

export const createCapsule = async () => {
    // const { msg } = await apiClient.post<>("/api/capsule");
    // return msg;
};
