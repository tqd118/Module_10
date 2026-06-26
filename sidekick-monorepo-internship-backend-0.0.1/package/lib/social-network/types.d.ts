export interface Like {
    id: number;
    postId: number;
    userId: number;
    creationDate: string;
}
export interface Comment {
    id: number;
    text: string;
    authorId: number;
    postId: number;
    creationDate: string;
    modifiedDate: string;
}
export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    image?: string;
    creationDate: string;
    likesCount: number;
    modifiedDate: string;
    commentsCount: number;
    likedByUsers?: User[];
}
export interface User {
    id: number;
    username: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    firstName?: string;
    secondName?: string;
    description: string;
    lastLogin: string;
    creationDate: string;
    modifiedDate: string;
}
export interface Group {
    id: number;
    title: string;
    photo: string;
    membersCount: number;
}
