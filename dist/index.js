import { GoogleGenerativeAI } from "@google/generative-ai";
import { addTodo, deleteTodo, fetchTodos, searchTodo, updateTodo } from "./utils/todos.js";
import dotenv from "dotenv";
import readLineSync from "readline-sync";
dotenv.config();
const tools = {
    "addTodo": addTodo,
    "deleteTodo": deleteTodo,
    "updateTodo": updateTodo,
    "fetchTodos": fetchTodos,
    "searchTodo": searchTodo
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
- function deleteTodo(id:string):"success"|"error"
it is a function that allows you to delete a todo from the database
- function updateTodo({id,string}:{id:number,todo:string}):"success"|"error"
it is a function that allows you to update a todo in the database
- function fetchTodos():Array[{id:number,todo:string,createdAt:Date,updatedAt:Date}]
it is a function that allows you to fetch todos from the database
- function searchTodo(query:string):Array[{id:number,todo:string,createdAt:Date,updatedAt:Date}]
it is a function that allows you to search for todos having that particular query in their todo field

You only have the above functions. for any other actions do it yourself or deny the service to the user.
Always convey date related information to the user in a format the user can understand.
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
{"type":"output","output":"There is 1 todo created by you in the last 24 hours and is about doing maths homework and was created on 7th september"}
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
{"type":"user","user":"are there any todo of playing a guitar?"}
{"type":"plan","plan":"I will call the searchTodo function to search for todos having the term guitar"}
{"type":"action","function":"searchTodo","input":"guitar"}
{"type":"observation","observation":[]}
{"type":"output","output":"no such todos found!"}
`;
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
        responseMimeType: "application/json",
    }
});
const messages = []; // to maintain the conversation context
async function main() {
    while (true) {
        console.log("Gemini AI Agent. Type 'exit' to quit.");
        const query = readLineSync.question(">> ");
        if (query.toLowerCase() == "exit") {
            console.log("Exiting...");
            process.exit();
        }
        messages.push({
            role: "user",
            parts: [{ text: JSON.stringify({ type: "user", user: query }) }]
        });
        while (true) {
            const chatResult = await model.generateContent({
                contents: messages
            });
            const rawResponse = chatResult.response.candidates?.[0]?.content.parts[0]?.text;
            console.log("\n\n--- Agent Response ---");
            console.log(rawResponse);
            console.log("----------------------\n\n");
            if (rawResponse) {
                messages.push({ role: "model", parts: [{ text: rawResponse }] });
                const call = JSON.parse(rawResponse);
                if (call.type === "output") {
                    console.log(`Final Response: ${call.output}`);
                    break; // Exit the inner loop and wait for new user input
                }
                else if (call.type === "action") {
                    // @ts-ignore
                    const fn = tools[call.function];
                    const obs = await fn(call.input ? call.input : null);
                    // Add the observation back to the conversation as a user part
                    messages.push({
                        role: "user",
                        parts: [{ text: JSON.stringify({ type: "observation", observation: obs }) }]
                    });
                }
            }
        }
    }
}
main();
//# sourceMappingURL=index.js.map