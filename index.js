/* importing the express package locally */
const express = require('express');
/* declaring the variable 'app' and attached all functionalities of express to it */
const app = express();

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Welcome to my book club!\n');
}).listen(8080);

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

