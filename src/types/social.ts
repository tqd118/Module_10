export interface Post {
	id: `post-${string}`;
	authorId: User["id"];
	text: string;
	image: string | null;
	likes: User["id"][];
	comments: Comment["id"][];
	createdAt: string;
}

export interface User {
	id: `user-${string}`;
	username: string;
    userIcon: string;
	userFullName: string;
	userMail: string;
	userPassword: string;
	likedPosts: Post["id"][];
	comments: Comment["id"][];
	userDescription: string;
}

export interface Comment {
    id: `comment-${string}`;
    postId: Post["id"];
    authorId: User["id"];
    text: string;
}

export interface Group {
	id: `group-${string}`;
	name: string;
	groupIcon: string;
	memberCount: number;
}