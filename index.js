const express = require('express');
    morgan = requre('morgan');

const app = express();

let topMovies = [
    {
        title: 'Star Wars',
        director: 'George Lucas',
        year: 1977
    },

    {
        title: 'Warrior',
        director: 'Gavin O\'Connor',
        year: 2011
    },

    {
        title: 'Tropic Thunder',
        director: 'Ben Stiller',
        year: 2008
    },

    {
        title: 'Hercules',
        directors: [
            'John Musker',
            'Ron Clements'
        ], 
        year: 1997
    },

    {
        title: '300', 
        director: 'Zack Snyder',
        year: 2007
    },

    {
        title: 'The Wolf of Wall Street',
        director: 'Martin Scorsese',
        year: 2013
    },

    {
        title: 'Taladega Nights',
        director: 'Adam McKay',
        year: 2006
    },

    {
        title: 'The Patriot',
        director: 'Roland Emmerich',
        year: 2000
    },

    {
        title: 'V For Vendetta',
        director: 'Jame McTeigue',
        year: 2005
    },

    {
        title: 'The Punisher',
        director: 'Jonathan Hensleigh',
        year: 2004
    }
    
];

app.use(express.static('public'));

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to my myFlix API!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong.')
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
