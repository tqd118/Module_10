import type { Post, User, Comment, Group } from "@/types/social"

export interface SocialState {
    posts: Post[];
    users: User[];
    comments: Comment[];
    groups: Group[];
}