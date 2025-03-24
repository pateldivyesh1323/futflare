import { apiClient } from "../lib";
import {
    CapsuleWithoutContent,
    APIResponseType,
    CreateCapsuleType,
    ContentType,
    PresignedAWSResponse,
    APIResponseWithPagination,
} from "../types";

export const getCapsules = async ({
    sortBy,
    searchQuery,
    page,
    limit,
}: {
    sortBy: string;
    searchQuery: string;
    page: number;
    limit: number;
}) => {
    const { data } = await apiClient.get<
        APIResponseWithPagination<CapsuleWithoutContent[]>
    >(
        `/api/capsule?sortBy=${sortBy}&searchQuery=${searchQuery}&page=${page}&limit=${limit}`
    );
    return data;
};

export const getCapsule = async (id: string) => {
    const { data } = await apiClient.get<
        APIResponseType<CapsuleWithoutContent>
    >(`/api/capsule/${id}`);
    return data;
};

export const createCapsule = async (newCapsule: CreateCapsuleType) => {
    const { data } = await apiClient.post<
        APIResponseType<CapsuleWithoutContent>
    >("/api/capsule", newCapsule);
    return data;
};

export const getPresignedUrl = async ({
    content_type,
    file_name,
}: {
    content_type: ContentType;
    file_name: string;
}) => {
    const { data } = await apiClient.post<
        APIResponseType<PresignedAWSResponse>
    >("/api/uploader/presigned-url", { content_type, file_name });
    return data;
};

export const deleteCapsule = async (id: string) => {
    const { data } = await apiClient.delete<APIResponseType<void>>(
        `/api/capsule/${id}`
    );
    return data;
};
