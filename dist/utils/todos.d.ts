export declare const fetchTodos: () => Promise<"error" | {
    todo: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const deleteTodo: (id: string) => Promise<"error" | "success">;
export declare const updateTodo: (id: string, todo: string) => Promise<"error" | "success">;
export declare const addTodo: (todo: string) => Promise<"error" | "success">;
export declare const searchTodo: (query: string) => Promise<"error" | {
    todo: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
//# sourceMappingURL=todos.d.ts.map