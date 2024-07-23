export interface Capsule {
    _id: string;
    creator: string;
    title: string;
    message: string;
    memories: string[];
    status: StatusType;
    member: string[];
}

export enum Status {
    LOCKED = "LOCKED",
    UNLOCKED = "UNLOCKED",
}

export type StatusType = {
    Locked: Status.LOCKED;
    UnLocked: Status.UNLOCKED;
};
