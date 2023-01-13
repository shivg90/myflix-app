/* importing the express package locally */
const express = require('express');
/* declaring the variable 'app' and attached all functionalities of express to it */
const app = express();

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Welcome to my book club!\n');
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');