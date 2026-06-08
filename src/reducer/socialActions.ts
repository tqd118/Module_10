import type { Post, User } from "../types/social"

export type SocialAction =
    | {
        type: "CREATE_POST"
        payload: {
            authorId: User["id"],
            image?: string,
            text: string
        }
      }
    | {
        type: "TOGGLE_LIKE"
        payload: {
            postId: Post["id"],
            userId: User["id"]
        }
      }
    | {
        type: "CREATE_COMMENT"
        payload: {
            postId: Post["id"],
            authorId: User["id"],
            text: string
        }
      }
    | {
        type: "UPDATE_USER"
        payload: {
            id: User["id"],
            data: Partial<User>

        }
      }
    | {
        type: "CREATE_USER"
        payload: {
            id: User["id"],
            userMail: User["userMail"],
            userPassword: User["userPassword"]
        }
      }