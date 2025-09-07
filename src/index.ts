import client from "./db/db.js";
import { addTodo, deleteTodos, fetchTodos, updateTodo } from "./utils/todos.js";

const tools = [
    addTodo,
    deleteTodos,
    updateTodo,
    fetchTodos
]

async function main() {
    try {
        await client.todo.create({
            data: {
                todo: "Test Todo",
            },
        });
        console.log("todo added");
    } catch (error) {
        console.error(error);
    } finally {
        await client.$disconnect();
    }
}

main();
