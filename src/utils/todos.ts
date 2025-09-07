import client from "../db/db.js"

export const fetchTodos = async () => {
    try {
        const todos = await client.todo.findMany();
        return todos;
    } catch (error) {
        return "error"
    }
}

export const deleteTodos = async (id: number) => {
    try {
        await client.todo.delete({
            where: {
                id
            }
        })
        return "success"
    } catch (error) {
        return "error"
    }
}

export const updateTodo = async (id: number, todo: string) => {
    try {
        await client.todo.update({
            where: {
                id
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