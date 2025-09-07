import client from "../db/db.js";
export const fetchTodos = async () => {
    try {
        const todos = await client.todo.findMany();
        return todos;
    }
    catch (error) {
        return "error";
    }
};
export const deleteTodo = async (id) => {
    try {
        await client.todo.delete({
            where: {
                id: parseInt(id)
            }
        });
        return "success";
    }
    catch (error) {
        return "error";
    }
};
export const updateTodo = async (id, todo) => {
    try {
        await client.todo.update({
            where: {
                id: parseInt(id)
            },
            data: {
                todo
            }
        });
        return "success";
    }
    catch (error) {
        return "error";
    }
};
export const addTodo = async (todo) => {
    try {
        await client.todo.create({
            data: {
                todo
            }
        });
        return "success";
    }
    catch (error) {
        console.log(error);
        return "error";
    }
};
//# sourceMappingURL=todos.js.map