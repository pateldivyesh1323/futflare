import { apiClient } from "../lib";
import { Capsule } from "../types";

export const getCapsules = async () => {
    const { data } = await apiClient.get<Capsule[]>("/api/capsule");
    return data;
};
