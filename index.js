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
/* allows the return of multiple static files in response to a request */
app.use(express.static('public'));
/* invoking morgan, instead of myLogger() function */
app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt.log', {flags: 'a'})
}));
app.use(morgan('dev'));

/* homepage text response */
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix Movie App!');
});

/* GET request for all users with MONGOOSE */

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

/* GET a specific user by username with MONGOOSE */

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

/* GET request for all movies with MONGOOSE */
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
/* OLD CODE 
    res.status(200).json(movies);
  }); */

/* GET a specific movie by title with MONGOOSE */
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
  /* OLD CODE
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('this movie doesn\'t exist!')
  }
}) */

/* GET movie data by genre name with MONGOOSE */
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
/* OLD CODE
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.genre.name === genreName ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('this genre doesn\'t exist!')
  }
}) */

/* GET movie data by director name with MONGOOSE */
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
/* OLD CODE
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('this director doesn\'t exist!')
  }
}) */

/* POST: allows new users to register with MONGOOSE */
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
/* OLD CODE before database creation 
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('user name required');
  }
})

*/

/* PUT: UPDATE user info by username using MONGOOSE */
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
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

/* OLD CODE
  const { id } = req.params;
  const updateUser = req.body;
  // only use 2 = rather than 3 = as user.id is a number but id is  a string //
  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('user name not found')

  }
}) */

/* POST: allow users to add a movie to their favourites with MONGOOSE  */
app.post('/users/:id/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.UserID }, {
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
/* OLD CODE 
  const { id, movieTitle } = req.params;
  
  // only use 2 = rather than 3 = as user.id is a number but id is  a string //
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('user name not found')

  }
}) */

/* DELETE: allow users to remove a movie from favourites with MONGOOSE */
app.delete('/users/:Username/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
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
/* OLD CODE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  // only use 2 = rather than 3 = as user.id is a number but id is  a string //
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle )
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('user name not found')

  }
}) */

/* DELETE: allow users to de-register with MONGOOSE */
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
/*OLD CODE
  const { id } = req.params;
  
  // only use 2 = rather than 3 = as user.id is a number but id is  a string //
  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id )
    res.status(200).send(` user ${id} has been successfully deleted `);
  } else {
    res.status(400).send('user name not found')

  }
}) */


/* error handler comes after all route calls and app.use but before app.listen */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('It\'s not working right now!');
  });

/* listen for requests, replaces http.createServer code */
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

/*
  var movie2 = {
  Title: "Pulp Fiction",
  Description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption",
  Genre: {
  Name: "Drama",
  Description: "Drama film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well."
  },
  Director: {
  Name: "Quentin Tarantino",
  Bio: "Quentin Jerome Tarantino is an American film director, writer, producer, and actor.",
  Birth: "1963"
  },
  ImagePath: "pulpfiction.png",
  Featured: false,
  Release: "1994"
  }

  db.movies.insertOne(movie2)
  insertedId: ObjectId("63c951afa2cd9cc18afcc34a")
  new "63ca696e170a52b50cf0be8c"

  */

/*
  var movie3 = {
  Title: "High Fidelity",
  Description: "Rob, a record store owner and compulsive list maker, recounts his top five breakups, including the one in progress.",
  Genre: {
  Name: "Comedy",
  Description: "Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect."
  },
  Director: {
  Name: "Stephen Frears",
  Bio: "Stephen Arthur Frears is an English director and producer of film and television often depicting real life stories.",
  Birth: "1941"
  },
  ImagePath: "highfidelity.png",
  Featured: false,
  Release: "2000"
  }

  db.movies.insertOne(movie3)
  insertedId: ObjectId("63c95925a2cd9cc18afcc34b")

  */

/*
  var movie4 = {
  Title: "Kill Bill",
  Description: "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.",
  Genre: {
  Name: "Action",
  Description: "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself."
  },
  Director: {
  Name: "Quentin Tarantino",
  Bio: "Quentin Jerome Tarantino is an American film director, writer, producer, and actor.",
  Birth: "1963"
  },
  ImagePath: "killbill.png",
  Featured: false,
  Release: "2003"
  }

  db.movies.insertOne(movie4)
  insertedId: ObjectId("63c95a38a2cd9cc18afcc34c")

  */

/*
  var movie5 = {
  Title: "Psycho",
  Description: "A Phoenix secretary embezzles $40,000 from her employer''s client, goes on the run and checks into a remote motel run by a young man under the domination of his mother.",
  Genre: {
  Name: "Horror",
  Description: "Horror is a genre that is meant to scare, startle, shock, and even repulse audiences. The key focus of a horror film is to elicit a sense of dread in the viewer through frightening images, themes, and situations."
  },
  Director: {
  Name: "Alfred Hitchcock",
  Bio: "Sir Alfred Joseph Hitchcock KBE was an English filmmaker.",
  Birth: "1899",
  Death: "1980"
  },
  ImagePath: "psycho.png",
  Featured: true,
  Release: "1960"
  }

  db.movies.insertOne(movie5)
  insertedId: ObjectId("63c95b3da2cd9cc18afcc34d")

  */

/*
  var movie6 = {
  Title: "Taxi Driver",
  Description: "A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.",
  Genre: {
  Name: "Drama",
  Description: "Drama film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well."
  },
  Director: {
  Name: "Martin Scorsese",
  Bio: "Martin Charles Scorsese is an American film director, producer, screenwriter and actor.",
  Birth: "1942"
  },
  ImagePath: "taxidriver.png",
  Featured: false,
  Release: "1976"
  }

  db.movies.insertOne(movie6)
  insertedId: ObjectId("63c95dc5a2cd9cc18afcc34e")

  */

/*
  var movie7 = {
  Title: "Vertigo",
  Description: "A former San Francisco police detective juggles wrestling with his personal demons and becoming obsessed with the hauntingly beautiful woman he has been hired to trail, who may be deeply disturbed.",
  Genre: {
  Name: "Thriller",
  Description: "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience."
  },
  Director: {
  Name: "Alfred Hitchcock",
  Bio: "Sir Alfred Joseph Hitchcock KBE was an English filmmaker.",
  Birth: "1899",
  Death: "1980"
  },
  ImagePath: "vertigo.png",
  Featured: false,
  Release: "1958"
  }

  db.movies.insertOne(movie7)
  insertedId: ObjectId("63c95edfa2cd9cc18afcc34f")

  */

/*
  var movie8 = {
  Title: "Mean Streets",
  Description: "A small-time hood tries to keep the peace between his friend Johnny and Johnny\'s creditors.",
  Genre: {
  Name: "Thriller",
  Description: "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience."
  },
  Director: {
  Name: "Martin Scorsese",
  Bio: "Martin Charles Scorsese is an American film director, producer, screenwriter and actor.",
  Birth: "1942"
  },
  ImagePath: "meanstreets.png",
  Featured: false,
  Release: "1973"
  }

  db.movies.insertOne(movie8)
  insertedId: ObjectId("63c95fdda2cd9cc18afcc350")

  */

/*
  var movie9 = {
  Title: "The Breakfast Club",
  Description: "Five high school students meet in Saturday detention and discover how they have a lot more in common than they thought.",
  Genre: {
  Name: "Comedy",
  Description: "Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect."
  },
  Director: {
  Name: "John Hughes",
  Bio: "John Wilden Hughes Jr. was an American filmmaker.",
  Birth: "1950",
  Death: "2009"
  },
  ImagePath: "thebreakfastclub.png",
  Featured: false,
  Release: "1985"
  }

  db.movies.insertOne(movie9)
  insertedId: ObjectId("63c960e2a2cd9cc18afcc351")

  */

/*
  var movie10 = {
  Title: "Seven Samuri",
  Description: "Farmers from a village exploited by bandits hire a veteran samurai for protection, who gathers six other samurai to join him.",
  Genre: {
  Name: "Thriller",
  Description: "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience."
  },
  Director: {
  Name: "Akira Kurosawa",
  Bio: "Akira Kurosawa was a Japanese filmmaker and painter who directed thirty films in a career spanning over five decades.",
  Birth: "1910",
  Death: "1998"
  },
  ImagePath: "sevensamuri.png",
  Featured: false,
  Release: "1954"
  }

  db.movies.insertOne(movie10)
  insertedId: ObjectId("63c968a4a2cd9cc18afcc352")

  */

/*
  var user1 = {
  Username: "John10",
  Password: "password1",
  Email: "john10@outlook.com",
  Birthday: new Date("1989-04-28"),
  FavouriteMovies: "The Breakfast Club"
  }
  

  db.users.insertOne(user1)
  insertedId: ObjectId("63c9a489a2cd9cc18afcc353")

  */

/*
  var user2 = {
  Username: "Hannah11",
  Password: "password2",
  Email: "hannah11@outlook.com",
  Birthday: new Date("1998-09-17"),
  FavouriteMovies: { "Seven Samuri", "High Fidelity" }
  }
  

  db.users.insertOne(user2)
  insertedId: ObjectId("63c9aaafa2cd9cc18afcc354")

  */

/*
  var user3 = {
  Username: "David12",
  Password: "password3",
  Email: "david12@outlook.com",
  Birthday: new Date("1990-01-03"),
  FavouriteMovies: ""
  

  db.users.insertOne(user3)
  insertedId: ObjectId("63c9ab0ea2cd9cc18afcc355")

  */

/*
  var user4 = {
  Username: "Sarah13",
  Password: "password4",
  Email: "sarah13@outlook.com",
  Birthday: new Date("2000-02-21"),
  FavouriteMovies: ""
  

  db.users.insertOne(user4)
  insertedId: ObjectId("63c9ab5fa2cd9cc18afcc356")

  */

/*
  var user5 = {
  Username: "Max14",
  Password: "password5",
  Email: "max14@outlook.com",
  Birthday: new Date("1975-05-28"),
  FavouriteMovies: ""
  

  db.users.insertOne(user5)
  insertedId: ObjectId("63c9abb0a2cd9cc18afcc357")

  */

  /*
  db.movies.deleteOne({Title: "Silence of the Lambs"})
  */

  /*
Title: "Psycho",
Description: "A Phoenix secretary embezzles $40,000 from her employer\'s client, goes on the run and checks into a remote motel. The motel is managed by a quiet young man called Norman who seems to be dominated by his mother."*/