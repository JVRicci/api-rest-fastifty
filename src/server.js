"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var port = 3333;
var app = (0, fastify_1.default)();
app.get('/hello', function () {
    return 'hello world';
});
app.listen({
    port: port
}).then(function () {
    console.log("Server is running on port ".concat(port));
});
