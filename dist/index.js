import client from "./db/db.js";
async function main() {
    try {
        await client.todo.create({
            data: {
                todo: "Test Todo",
            },
        });
        console.log("todo added");
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.$disconnect();
    }
}
main();
//# sourceMappingURL=index.js.map