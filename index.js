/* importing the express package locally */
const express = require('express');
/* importing morgan */
  morgan = require('morgan');
/* declaring the variable 'app' and attached all functionalities of express to it */
const app = express();

/* invoking morgan, instead of myLogger() function */
app.use(morgan('common'));

/* allows the return of multiple static files in response to a request */
app.use(express.static('public'));


/* GET requests */
app.get('/movies', (req, res) => {
    res.json('myMovies');
  });

/* res.send object replaces response.writeHead and response.end code */
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix Movie App!');
});

/* error handler comes after all route calls and app.use but before app.listen */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('It\'s not working right now!');
  });

/* listen for requests, replaces http.createServer code */
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });



/* OLD CODE */
// const http = require('http');

// http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.end('Welcome to my book club!\n');
// }).listen(8080);

// console.log('My first Node test server is running on Port 8080.');