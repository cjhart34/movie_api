const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

mongoose.connect(process.env.CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('common'));

// Import and use CORS but allow all domains to make requests
const cors = require('cors');
app.use(cors());

//authentication (importing passport)
let auth = require('./auth')(app);
const passport = require('passport');
const { authenticate } = require('passport/lib');
require('./passport');

/**
* GET welcome message from '/' endpoint
* @name welcomeMessage
* @kind function
* @returns Welcome message
*/
app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

/**
* POST new user. Username, password, and Email are required fields.
* Request body: Bearer token, JSON with user information in this format:
* {
*  ID: Integer,
*  Username: String,
*  Password: String,
*  Email: String,
*  Birthday: Date
* }
* @name createUser
* @kind function
* @returns user object
*/
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 3 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is not valid').isEmail(),
    check('Birthday', 'Birthday must be in the date format').isDate()
  ], (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
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
  });

// Add a movie to a user's list of favorites
/**
* POST a movie to a user's list of favorites
* Request body: Bearer token
* @name createFavorite
* @kind function
* @param Username
* @param MovieID
* @returns user object
* @requires passport
*/
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
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

// Update a user's info, by username
/**
* PUT new user info
* Request body: Bearer token, updated user info in the following format:
* {
*  Username: String, (required)
*  Password: String, (required)
*  Email: String, (required)
*  Birthday: Date
* }
* @name updateUser
* @kind function
* @param Username
* @returns user object
* @requires passport
*/
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({ min: 3 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail(),
  check('Birthday', 'Birthday must be in the date format').isDate()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
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

// Remove a movie from favorites
/**
* DELETE a movie from a user's list of favorites
* Request body: Bearer token
* @name deleteFavorite
* @kind function
* @param Username
* @param MovieID
* @returns user object
* @requires passport
*/
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    },
  );
});

// Delete a user by username
/**
* DELETE a user by username
* Request body: Bearer token
* @name deleteUser
* @kind function
* @param Username
* @returns Success message
* @requires passport
*/
app.delete('/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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

// Get a list of all movies
/**
* GET a list of all movies
* Request body: Bearer Token
* @name getAllMovies
* @kind function
* @returns array of movie objects
* @requires passport
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Find movie by title
/**
* GET data about a single movie by title
* Request body: Bearer token
* @name getMovie
* @kind function
* @param Title
* @returns movie object
* @requires passport
*/
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a genre by movie title
// app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.findOne({ Title: req.params.Title })
//     .then((movies) => {
//       if (movies) {
//         res.status(200).send(`${req.params.Title} is a ${movies.Genre.name} movie. <br> ${movies.Genre.description}`);
//       } else {
//         res.status(400).send('Movie not Found');
//       }
//     });
// });

// Return data about a genre by name
/**
* GET data about a genre by genre name
* Request body: Bearer token
* @name getGenre
* @kind function
* @param genreName
* @returns genre object
* @requires passport
*/
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
// app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.find()
//     .then((users) => {
//       res.status(201).json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// Get a user by username
/**
* GET user data on a single user
* Request body: Bearer token
* @name getUser
* @kind function
* @param Username
* @returns user object
* @requires passport
*/
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director by name
/**
* GET data about a director by name
* Request body: Bearer token
* @name getDirector
* @kind function
* @param directorName
* @returns director object
* @requires passport
*/
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.name': req.params.Name }).then((movies) => {
    if (movies) {
      res.status(200).json(movies.Director);
    } else {
      res.status(400).send('Director Not Found');
    }
  });
});

// app.get('/secreturl', (req, res) => {
//   res.send('This is a secret url with super top-secret content.');
// });

/**
* Error handler
* @name errorHandler
* @kind function
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.')
});

/**
* Request listener
*/
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port ' + port);
});