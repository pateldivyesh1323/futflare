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

export interface ContentItem {
    type: string;
    url: string;
    text: string;
}

export type CapsuleWithoutContent = Omit<Capsule, "content_items">;
