const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObj.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service, {
    "createTodo": createNewTodo,
    "readTodos": readAllTodo,
    "readTodoStream": readTodoStream
});

server.start();

const todos = [];

function createNewTodo(call, callback) {
    const todoItem = {
        "id" : todos.length + 1,
        "text" : call.request.text
    };
    todos.push(todoItem);
    callback(null, todoItem);
}

function readAllTodo(call, callback) {
    callback(null, {"items": todos});
}

function readTodoStream(call, callback) {
    todos.forEach (t => call.write(t));
    call.end();
}