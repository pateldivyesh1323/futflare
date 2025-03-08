export interface Capsule {
    _id: string;
    creator: string;
    title: string;
    description: string;
    participant_emails: string[];
    is_opened: boolean;
    content_items: ContentItem[];
    created_at: Date;
    scheduled_open_date: Date;
}

export type CreateCapsuleType = Omit<
    Capsule,
    "_id" | "is_opened" | "created_at" | "creator"
>;

export type ContentType = "message" | "image" | "video";

export interface ContentItem {
    type: ContentType;
    content: ContentItemDetail;
}

export type ContentItemDetail = MessageContent | ImageContent | VideoContent;

export interface MessageContent {
    text: string;
}

export interface ImageContent {
    url: string;
    caption: string;
    alt_text: string;
}

export interface VideoContent {
    url: string;
    caption: string;
}

export interface APIResponseType<T> {
    message: string;
    data: T;
}

export type CapsuleWithoutContent = Omit<Capsule, "content_items">;

export interface PresignedAWSResponse {
    presigned_url: string;
    object_key: string;
    content_type: ContentType;
    final_url: string;
}
