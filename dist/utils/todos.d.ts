export declare const fetchTodos: () => Promise<"error" | {
    todo: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const deleteTodo: (id: number) => Promise<"error" | "success">;
export declare const updateTodo: (id: number, todo: string) => Promise<"error" | "success">;
export declare const addTodo: (todo: string) => Promise<"error" | "success">;
//# sourceMappingURL=todos.d.ts.map