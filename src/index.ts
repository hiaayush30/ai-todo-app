import { GoogleGenerativeAI } from "@google/generative-ai";
import client from "./db/db.js";
import { addTodo, deleteTodo, fetchTodos, updateTodo } from "./utils/todos.js";
import dotenv from "dotenv"
dotenv.config();

const tools = [
    addTodo,
    deleteTodo,
    updateTodo,
    fetchTodos
]

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// System prompt to guide the AI's behavior
const SYSTEM_PROMPT = `
You are an ai assistant with START,PLAN and ACTION, OBSERVATION and OUTPUT state.
Wait for the user prompt and first PLAN using available tools.
After Planning, take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations

Strictly follow the JSON output format as in exmples

Available Tools:
- function addTodo(todo:string):"success"|"error"
it is a function that allows you to add a todo to the database
- function deleteTodo(id:number):"success"|"error"
it is a function that allows you to delete a todo from the database
- function updateTodo({id,number}:{id:number,todo:string}):"success"|"error"
it is a function that allows you to update a todo in the database
- function fetchTodos():Array[{id:number,todo:string,createdAt:Date,updatedAt:Date}]
it is a function that allows you to fetch todos from the database

You only have the above functions. for any other actions do it yourself or deny the service to the user.

Example:
START
{"type":"user","user":"update my todo which was about doing dsa to complete my maths homework"}
{"type":"plan","plan":"I will call the fetchTodos function to get the todos"}
{"type":"action","function":"fetchTodos"}
{"type":"observation","observation":"[{id:1,todo:"do dsa",createdAt:2025-09-07 18:13:18.996,updatedAt:2025-09-07 18:13:18.996},{id:2,todo:"drink whey protein",createdAt:2025-09-05 18:13:18.996,updatedAt:2025-09-05 18:13:18.996}]"}
{"type":"plan","plan":"I will call the updateTodo function to update the todo"}
{"type":"action","function":"updateTodo","input":"{id:1,todo:"do maths homework"}"}
{"type":"observation","observation":"success"}
{"type":"output","output":"Todo updated successfully"}
{"type":"user","user":"Are there any todos I created yesterday?"}
{"type":"output","output":"There is 1 todo created by you in the last 24 hours and is about doing maths homework"}
{"type":"user","user":"add a todo to do my dishes"}
{"type":"plan","plan":"I will call the addTodo function to add the todo"}
{"type":"action","function":"addTodo","input":"do dishes"}
{"type":"observation","observation":"success"}
{"type":"output","output":"Todo added successfully"}
{"type":"user","user":"add another todo to go to college"}
{"type":"plan","plan":"I will call the addTodo function to add the todo"}
{"type":"action","function":"addTodo","input":"go to college"}
{"type":"observation","observation":"error"}
{"type":"output","output":"Unfornutely, the todo could not be added, please try again at a later time"}
{"type":"user","user":"delete the todo of doing maths homework"}
{"type":"plan","plan":"I will call the deleteTodo function to add the todo"}
{"type":"action","function":"deleteTodo","input":1}
{"type":"observation","observation":"success"}
{"type":"output","output":"todo deleted successfully!"}
`;

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
