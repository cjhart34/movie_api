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

// let movies = [
//     {
//         'Title': 'Star Wars',
//         'Description': 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
//         'Genre': {
//             'Name': 'Sci-Fi',
//             'Description': 'A fictionalized story wherein the setting and plot are centered around technology, time travel, outer space, or scientific principles, with or without the presence of aliens.'
//         },

//         'Director': {
//             'Name': 'George Lucas',
//             'Bio': 'American film director, producer, screenwriter, and entrepreneur. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, and Industrial Light & Magic.',
//             'Birth': 1944
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Star_wars2.svg/1920px-Star_wars2.svg.png',
//         'Featured': false,
//         'Year': 1977
//     },

//     {
//         'Title': 'Warrior',
//         'Description': 'The youngest son of an alcoholic former boxer returns home, where he\'s trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.',
//         'Genre': {
//             'Name': 'Action',
//             'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
//         },

//         'Director': {
//             'Name': 'Gavin O\'Connor',
//             'Bio': 'American film director, screenwriter, producer, playwright, and actor. He is best known for directing the films Miracle, Warrior, The Accountant, and The Way Back.',
//             'Birth': 1963
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/e/e3/Warrior_Poster.jpg',
//         'Featured': false,
//         'Year': 2011
//     },

//     {
//         'Title': 'Tropic Thunder',
//         'Description': 'Through a series of freak occurrences, a group of actors shooting a big-budget war movie are forced to become the soldiers they are portraying.',
//         'Genre': {
//             'Name': 'Comedy',
//             'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
//         },

//         'Director': {
//             'Name': 'Ben Stiller',
//             'Bio': 'American actor, comedian, and filmmaker. His films have grossed more than $2.6 billion in Canada and the United States, with an average of $79 million per film.[2] Throughout his career, he has received various awards and honors, including an Emmy Award, multiple MTV Movie Awards, a Britannia Award and a Teen Choice Award.',
//             'Birth': 1965
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/d/d6/Tropic_thunder_ver3.jpg',
//         'Featured': false,
//         'Year': 2008
//     },

//     {
//         'Title': 'Hercules',
//         'Description': 'The son of Zeus and Hera is stripped of his immortality as an infant and must become a true hero in order to reclaim it.',
//         'Genre': {
//             'Name': 'Comedy',
//             'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
//         },

//         'Director': {
//             'Name': 'John Musker',
//             'Bio': 'American animator, film director, screenwriter, and film producer. He often collaborates with fellow director Ron Clements and is best known for writing and directing the Disney films The Great Mouse Detective (1986), The Little Mermaid (1989), Aladdin (1992), Hercules (1997), Treasure Planet (2002), The Princess and the Frog (2009), and Moana (2016).',
//             'Birth': 1953
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/6/65/Hercules_%281997_film%29_poster.jpg',
//         'Featured': false,
//         'Year': 1997
//     },

//     {
//         'Title': '300',
//         'Description': 'King Leonidas of Sparta and a force of 300 men fight the Persians at Thermopylae in 480 B.C.',
//         'Genre': {
//             'Name': 'Action',
//             'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
//         },

//         'Director': {
//             'Name': 'Zack Snyder',
//             'Bio': 'American film director, film producer, and screenwriter, best known for action and science fiction films.',
//             'Birth': 1966
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/5/5c/300poster.jpg',
//         'Featured': false,
//         'Year': 2007
//     },

//     {
//         'Title': 'The Wolf of Wall Street',
//         'Description': 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
//         'Genre': {
//             'Name': 'Drama',
//             'Description': 'A genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//         },

//         'Director': {
//             'Name': 'Martin Scorsese',
//             'Bio': 'American film director, producer, screenwriter and actor. He is the recipient of many accolades, including an Academy Award, three Primetime Emmy Awards, a Grammy Award, four British Academy Film Awards, three Golden Globe Awards, and two Directors Guild of America Awards.',
//             'Birth': 1942
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/d/d8/The_Wolf_of_Wall_Street_%282013%29.png',
//         'Featured': false,
//         'Year': 2013
//     },

//     {
//         'Title': 'Talladega Nights',
//         'Description': 'Number one NASCAR driver Ricky Bobby stays atop the heap thanks to a pact with his best friend and teammate, Cal Naughton, Jr. But when a French Formula One driver, makes his way up the ladder, Ricky Bobby\'s talent and devotion are put to the test.',
//         'Genre': {
//             'Name': 'Comedy',
//             'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
//         },

//         'Director': {
//             'Name': 'Adam McKay',
//             'Bio': 'American film director, producer, screenwriter, and comedian. He rose to fame in the 2000s for his collaborations with comedian Will Ferrell and co-wrote his comedy films Anchorman, Talladega Nights, and The Other Guys.',
//             'Birth': 1968
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/e/e7/Talladega_nights.jpg',
//         'Featured': false,
//         'Year': 2006

//     },


//     {
//         'Title': 'The Patriot',
//         'Description': 'Peaceful farmer Benjamin Martin is driven to lead the Colonial Militia during the American Revolution when a sadistic British officer murders his son.',
//         'Genre': {
//             'Name': 'Action',
//             'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
//         },

//         'Director': {
//             'Name': 'Roland Emmerich',
//             'Bio': 'German film director, screenwriter, and producer. He is widely known for his science fiction and disaster films and has been called a "master of disaster" within the industry.',
//             'Birth': 1955
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/6/68/Patriot_promo_poster.jpg',
//         'Featured': false,
//         'Year': 2000
//     },

//     {
//         'Title': 'V For Vendetta',
//         'Description': 'In a future British dystopian society, a shadowy freedom fighter, known only by the alias of "V", plots to overthrow the tyrannical government - with the help of a young woman.',
//         'Genre': {
//             'Name': 'Action',
//             'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
//         },

//         'Director': {
//             'Name': 'James McTeigue',
//             'Bio': 'Australian film and television director. He has been an assistant director on many films, including Dark City (1998), the Matrix trilogy and Star Wars: Episode II Attack of the Clones (2002), and made his directorial debut with the 2005 film V for Vendetta to critical acclaim.',
//             'Birth': 1967
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/9/9f/Vforvendettamov.jpg',
//         'Featured': false,
//         'Year': 2006
//     },

//     {
//         'Title': 'The Punisher',
//         'Description': 'An undercover FBI agent becomes a vigilante and sets out to unleash his wrath upon the corrupt businessman who slaughtered his entire family at a reunion.',
//         'Genre': {
//             'Name': 'Action',
//             'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
//         },

//         'Director': {
//             'Name': 'Jonathan Hensleigh',
//             'Bio': 'American screenwriter and film director, working primarily in the action-adventure genre, best known for writing films such as Jumanji, Die Hard with a Vengeance, and Armageddon.',
//             'Birth': 1959
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/d/d9/Punisher_ver2.jpg',
//         'Featured': false,
//         'Year': 2004
//     },
//     {
//         'Title': 'The Departed',
//         'Description': 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
//         'Genre': {
//             'Name': 'Drama',
//             'Description': 'A genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//         },

//         'Director': {
//             'Name': 'Martin Scorsese',
//             'Bio': 'American film director, producer, screenwriter and actor. He is the recipient of many accolades, including an Academy Award, three Primetime Emmy Awards, a Grammy Award, four British Academy Film Awards, three Golden Globe Awards, and two Directors Guild of America Awards.',
//             'Birth': 1944
//         },
//         'ImageUrl': 'https://upload.wikimedia.org/wikipedia/en/5/50/Departed234.jpg',
//         'Featured': false,
//         'Year': 2006
//     }

// ];

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
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
            .then((user) => { res.status(201).json(user) })
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
  check('Username', 'Username is required').isLength({ min: 5 }),
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
app.get('/movies',
  // passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.find()
      .then(function (moviesList) {
        res.status(201).json(moviesList);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Find movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie)
  } else {
    res.status(400).send('No such movie')
  }
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

// Get info about a genre
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
    .then((foundMovie) => {
      res.status(201).json(foundMovie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get info about a director
app.get('/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Director })
    .then((foundMovie) => {
      res.status(201).json(foundMovie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
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