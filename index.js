/* importing all needed packages locally */
const express = require('express'),
    fs = require('fs'),
    path = require ('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const morgan = require('morgan');
const app = express();  
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

accessLogStream = fs.createWriteStream(path.join(__dirname, './log.txt.log'), {flags: 'a'});

mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(express.static('public'));
app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt.log', {flags: 'a'})
}));
app.use(morgan('dev'));

/* homepage text response */
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix Movie App!');
});

/* GET request for all movies at endpoint /movies */
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* GET a specific movie by title at endpoint /movies/:Title */
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* GET movie data by genre name at endpoint /movies/genre/:Name */
app.get('/movies/genre/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movies) => {
      res.status(201).json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* GET movie data by director name at endpoint /movies/director/:directorName */
app.get('/movies/director/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* POST route to add a new movie to database at endpoint /movies */
app.post('/movies', (req, res) => {
  Movies.findOne({ Username: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        Movies.create({
          Title: req.body.Title,
          Description: req.body.Description,
          Genre: {
            Name: req.body.Name,
            Description: req.body.Description,
          },
          Director: {
            Name: req.body.Name,
            Bio: req.body.Bio,
          },
          ImageURL: req.body.ImageURL,
          Featured: req.body.Boolean,
          Release: req.body.Date
        })
          .then((movie) => {
            res.status(201).json(movie);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
          });
        }
    });
});

/* POST allow users to add a movie to their favourites at endpoint /users/:id/movies/:MovieId */
app.post('/users/:id/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate({ UserId: req.params.UserId }, {
    $push: { FavoriteMovies: req.params.MovieId }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// code from Emanuel, delete a movie from favorites at endpoint /users/:id/favorites/:MovieId //

app.delete('users/:id/favorites/:movieId', async (req, res) => {
  try {
    const user = await
    user.findbyId(req.params.id);
    user.FavoriteMovies.pull(req.params.movieId);
    await user.save();
    res.status(200).json( { message: "Movie removed from favorites" } );
  }
  catch(err) {
    res.status(404).json( { message: err.message } );
  }
  });

/* DELETE: allow users to remove a movie from favourites at endpoint /users/:Username/:MovieId
app.delete('/users/:Username/:MovieId', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieId }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
}); */

/* GET all users at endpoint /users */

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* GET a specific user by username at endpoint /users/:Username */

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* POST: allows new users to register at endpoint /users */
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users.create({
      /* req.body is data input by user, the keys (eg Email) correlate to a field in models.js */
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      /* name of newly created document is in parenthesis after .then */
      .then((user) => {
        res.status(201).json(user) 
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
}
);

/* UPDATE user info by username at endpoint /users/:Username */
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    },
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/* DELETE a user at endpoint /users/:Username */
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/* GET api documentation at endpoint /documentation */
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
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

