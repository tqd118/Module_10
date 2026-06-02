export interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
	authorId: number;
	author?: Pick<User, "id" | "username" | "firstName" | "profileImage">;
    likesCount: number;
	likedByUsers: User[];
    commentsCount: number;
    creationDate: string;
	modifiedDate: string;
}

export interface User {
	id: number;
	username: string;
	email?: string;
	firstName?: string;
    profileImage?: string;
	description?: string;
	bio?: string;
	secondName?: string;
	likesCount?: number;
	lastLogin?: string;
	creationDate?: string;
	modifiedDate?: string;
}

export interface Comment {
    id: number;
    text: string;
    authorId: number;
    postId: number;
	creationDate: string;
	modifiedDate: string;
}

export interface Like {
	id: number;
	postId: number;
	userId: number;
	creationDate: string;
}

export interface Group {
	id: number;
	title: string;
	photo: string;
	membersCount: number;
}