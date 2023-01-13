/* importing the express package locally */
const express = require('express');
/* importing morgan */
  morgan = require('morgan');
/* declaring the variable 'app' and attached all functionalities of express to it */
const app = express();

const http = require('http');
/* invoking morgan, instead of myLogger() function */
app.use(morgan('common'));

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Welcome to my book club!\n');
}).listen(8080);
/* allows the return of multiple static files in response to a request */
app.use(express.static('public'));

console.log('My first Node test server is running on Port 8080.');    {
let myMovies = [
    {
      title: '2001: A Space Odyssey',
      release: '1968'
    },
    {
      title: 'The Godfather',
      release: '1972'
    },
    {
      title: 'Citizen Kane',
      release: '1941'
    },
    {
      title: 'Raiders of the Lost Ark',
      release: '1981'
    },
    {
      title: 'La Dolce Vita',
      release: '1960'
    },
    {
      title: 'Seven Samuri',
      release: '1954'
    },
    {
      title: 'In the Mood for Love',
      release: '2000'
    },
    { 
      title: 'There Will Be Blood',
      release: '2007'
    },
    {
      title: 'Singin\' in the Rain',
      release: '1952'
    },
    {
      title: 'High Fidelity',
      release: '2000'
    }

  ];

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

