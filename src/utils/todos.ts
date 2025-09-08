import client from "../db/db.js"

export const fetchTodos = async () => {
    try {
        const todos = await client.todo.findMany();
        return todos;
    } catch (error) {
        return "error"
    }
}

export const deleteTodo = async (id: string) => {
    try {
        await client.todo.delete({
            where: {
                id:parseInt(id)
            }
        })
        return "success"
    } catch (error) {
        return "error"
    }
}

export const updateTodo = async (id: string, todo: string) => {
    try {
        await client.todo.update({
            where: {
                id:parseInt(id)
            },
            data: {
                todo
            }
        })
        return "success"
    } catch (error) {
        return "error"
    }
}

export const addTodo = async (todo: string) => {
    try {

        await client.todo.create({
            data: {
                todo
            }
        })
        return "success"
    } catch (error) {
        console.log(error)
        return "error"
    }
}

export const searchTodo = async (query: string) => {
    try {
        const todos = await client.todo.findMany({
            where: {
                todo: {
                    contains: query,   // match substring
                    mode: "insensitive" // optional: makes search case-insensitive
                }
            }
        });
        return todos;
    } catch (error) {
        console.log(error);
        return "error";
    }
};
