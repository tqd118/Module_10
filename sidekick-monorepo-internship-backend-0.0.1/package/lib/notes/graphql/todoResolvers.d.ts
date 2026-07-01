import { TodoItem, NoteStatus } from '../types';

export declare const todoResolvers: {
    Query: {
        todos: (_parent: any, { status }: {
            status: NoteStatus | undefined;
        }, { request }: {
            request: Request;
        }) => Promise<TodoItem[]>;
    };
    Mutation: {
        createTodo: (_parent: any, { input }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        updateTodo: (_parent: any, { id, input }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        changeTodoStatus: (_parent: any, { id, newStatus }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        deleteTodo: (_parent: any, { id }: any, { request }: {
            request: Request;
        }) => Promise<{
            id: number;
            success: boolean;
        }>;
        toggleChecklistItem: (_parent: any, { todoId, itemId }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        updateChecklistItemText: (_parent: any, { todoId, itemId, text }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        uncheckAllItems: (_parent: any, { id }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
        updateTodoBackground: (_parent: any, { id, backgroundImage }: any, { request }: {
            request: Request;
        }) => Promise<TodoItem>;
    };
};
