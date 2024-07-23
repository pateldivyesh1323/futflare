import { apiClient } from "../lib";
import { Capsule } from "../types";

export const getCapsules = async () => {
    const { data } = await apiClient.get<Capsule[]>("/capsule");
    return data;
};
