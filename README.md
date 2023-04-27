# myFlix-API

## Objective
To build the server-side component of a movie web application called "myFlix".
The web application will provide users with access to information about different movies, directors, and genres. 
Users will be able to sign up, update their personal information, and create a list of their favorite movies.

The application implements a REST API with use of a self-made database hosted by mongoDB.\
Two client side components which use the API:
- https://github.com/shivg90/myFlix-client
- https://github.com/shivg90/myFlix-Angular-client

## Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

## 🚀 Tech Stack
- Node.js
- Express
- MongoDB

## Dependencies
- body-parser
- passport JWT
- uuid
- ESLint
- jsonwebtoken
- cors
- bcrypt

## Local Environment

1. Clone this repository from GitHub
2. Install node.js and mongoDB
3. Run npm install
4. Run npm start to connect to localhost server (default: 8080)

## Testing

The API endpoints can be tested using Postman

## Author

Please contact the API author at siobhangatenby@gmail.com for any questions or comments.



