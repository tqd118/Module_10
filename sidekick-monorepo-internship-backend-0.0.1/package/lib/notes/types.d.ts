export type NoteStatus = 'NOTES' | 'ARCHIVED' | 'TRASH';
export interface ChecklistItem {
    id: number;
    text: string;
    isCompleted: boolean;
}
export interface TodoItem {
    id: number;
    title: string;
    content?: string;
    items?: ChecklistItem[];
    status: NoteStatus;
    backgroundImage?: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
}
export interface User {
    id: number;
    username: string;
    email?: string;
    profileImage?: string;
    firstName?: string;
    secondName?: string;
    description: string;
    lastLogin: string;
    creationDate: string;
    modifiedDate: string;
}
