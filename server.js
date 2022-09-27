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

const cors = require('cors');
app.use(cors());

//authentication
let auth = require('./auth')(app);
const passport = require('passport');
const { authenticate } = require('passport/lib');
require('./passport');

// let users = [
//         {
//             "_id": "62fed89be5f56f387af5a1d8",
//             "Name": "John Derp",
//             "Username": "jderp14",
//             "Password": "11oderp",
//             "Email": "jd1114@gmail.com",
//             "Birthday": "1995-06-19T00:00:00.000Z",
//             "FavoriteMovies": [
//                 "62fed450e5f56f387af5a1d7",
//                 "62fed450e5f56f387af5a1d6"
//             ]
//         },
//         {
//             "_id": "62fedb42e5f56f387af5a1da",
//             "Name": "Ronald McDonald",
//             "Username": "mcdons",
//             "Password": "betterthanbk",
//             "Email": "mcdonalds@gmail.com",
//             "Birthday": "1963-05-01T00:00:00.000Z",
//             "FavoriteMovies": [
//                 "62fed403e5f56f387af5a1d5",
//                 "62fed3dee5f56f387af5a1d4"
//             ]
//         },
//         {
//             "_id": "62fedbb5e5f56f387af5a1db",
//             "Name": "Jimmy Neutron",
//             "Username": "jneut",
//             "Password": "smrtrthnu",
//             "Email": "jimmyn@gmail.com",
//             "Birthday": "1991-03-14T00:00:00.000Z",
//             "FavoriteMovies": [
//                 "62fed3dee5f56f387af5a1d4",
//                 "62fed3a1e5f56f387af5a1d3"
//             ]
//         },
//         {
//             "_id": "62fedc57e5f56f387af5a1dc",
//             "Name": "Mario Mario",
//             "Username": "mario",
//             "Password": "gottagetpeach",
//             "Email": "gotmushrooms@gmail.com",
//             "Birthday": "1965-05-27T00:00:00.000Z",
//             "FavoriteMovies": [
//                 "62fed3a1e5f56f387af5a1d3",
//                 "62fed31ae5f56f387af5a1d2",
//                 "62fed0aae5f56f387af5a1cd"
//             ]
//         }
// ];

app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 3 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is not valid').isEmail(),
    // check('Birthday', 'Birthday must be in the date format').isDate()
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
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

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
app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      if (movies) {
        res.status(200).send(`${req.params.Title} is a ${movies.Genre.name} movie. <br> ${movies.Genre.description}`);
      } else {
        res.status(400).send('Movie not Found');
      }
    });
});

// Return data about a genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.name': req.params.Name })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
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
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.name': req.params.Name }).then((movies) => {
    if (movies) {
      res.status(200).json(movies.Director);
    } else {
      res.status(400).send('Director Not Found');
    }
  });
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.')
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port ' + port);
});


// mongoimport --uri mongodb+srv://cjhart:buddybuddy@myflixdb1.cdmgkjg.mongodb.net/MyFlixDB1 --collection movies --type json --file ../movies.json
// mongodb+srv://cjhart:buddybuddy@myflixdb1.cdmgkjg.mongodb.net/MyFlixDB1?retryWrites=true&w=majority