import type { Comment, Post, User } from "@/types/social"
import type { SocialState } from "./social.types"
import type { SocialAction } from "./socialActions"


function createPost(state: SocialState, action: Extract<SocialAction, { type: "CREATE_POST" }>): SocialState {
    const newPost: Post = {
        id: `post-${ crypto.randomUUID() }`,
        authorId: action.payload.authorId,
        text: action.payload.text,
        image: action.payload.image || null,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
    }

    return {
        ...state,
        posts: [newPost, ...state.posts],
    }
}

function toggleLike(state: SocialState, action: Extract<SocialAction, { type: "TOGGLE_LIKE" }>): SocialState {
    const { postId, userId } = action.payload

    return {
        ...state,

        posts: state.posts.map(post => {
            if (post.id !== postId) {
                return post
            }

            const liked = post.likes.includes(userId)

            return {
                ...post,
                likes: liked ? post.likes.filter(id => id !== userId) : [...post.likes, userId],
            }
        }),

        users: state.users.map(user => {
            if (user.id !== userId) {
                return user
            }

            const liked = user.likedPosts.includes(postId)

            return {
                ...user,
                likedPosts: liked ? user.likedPosts.filter(id => id !== postId) : [...user.likedPosts, postId],
            }
        }),
    }
}

function createComment(state: SocialState, action: Extract<SocialAction, { type: "CREATE_COMMENT" }>): SocialState {
    const { postId, authorId, text } = action.payload

    const newComment: Comment = {
        id: `comment-${ crypto.randomUUID() }`,
        postId,
        authorId,
        text
    }

    return {
        ...state,

        comments: [...state.comments, newComment],

        posts: state.posts.map(post =>
            post.id === postId ? { ...post, comments: [...post.comments, newComment.id]} : post
        ),

        users: state.users.map(user =>
            user.id === authorId ? {...user, comments: [...user.comments, newComment.id]} : user
        ),
    }
}

function updateUser(state: SocialState, action: Extract<SocialAction, { type: "UPDATE_USER" }>): SocialState {
    const user = state.users.find(u => u.id === action.payload.id);
    if (!user) {
        return state;
    }

    const newUser = {
        ...user,
        ...action.payload.data
    };

    return {
        ...state,
        users: state.users.map(user => user.id === action.payload.id ? newUser : user)
    }
}

function createUser(state: SocialState, action: Extract<SocialAction, { type: "CREATE_USER" }>): SocialState {
    const newUser: User = {
        id: action.payload.id,
        username: "@guest",
        userIcon: "/assets/imgs/users/blank-user.png",
        likedPosts: [],
        comments: [],
        userFullName: "Anonymous",
        userMail: action.payload.userMail,
        userPassword: action.payload.userPassword,
        userDescription: ""
    } 

    return {
        ...state,
        users: [...state.users, newUser]
    }
}

export function socialReducer(state: SocialState, action: SocialAction): SocialState {
    switch (action.type) {
        case "CREATE_POST":
            return createPost(state, action);

        case "TOGGLE_LIKE":
            return toggleLike(state, action);

        case "CREATE_COMMENT":
            return createComment(state, action);

        case "UPDATE_USER":
            return updateUser(state, action);
            
        case "CREATE_USER":
            return createUser(state, action);
        
        default:
            return state;
    }
}