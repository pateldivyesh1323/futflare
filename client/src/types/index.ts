export interface Capsule {
    _id: string;
    creator: string;
    title: string;
    description: string;
    participants_email: string[];
    is_opened: boolean;
    content_items: ContentItem[];
}

export interface ContentItem {
    type: string;
    url: string;
    text: string;
}
