const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObj.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

const todoText = process.argv[2];

client.createTodo({
    "id": -1,
    "text": todoText
}, (err, response) => {
    console.log("Response: " + JSON.stringify(response));
})

client.readTodos({}, (err, response) => {
    console.log("Todos: " + JSON.stringify(response));
});

const call = client.readTodoStream();
call.on("data", item => {
    console.log("Got item in stream: " + JSON.stringify(item));
})

call.on("end", end => console.log("Server done!!"));