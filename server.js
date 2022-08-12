const bodyParser = require('body-parser');
const express = require('express');
const uuid = require('uuid')
const morgan = require('morgan');
const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

let users = [
{
    id: 1,
    Name: 'Corey Smith',
    favoriteMovies: ['Star Wars',
     'Talladega Nights']
},
{
    id: 2,
    Name: 'Jimmy Nuggets',
    favoriteMovies: ['Warrior', 
        'The Punisher']
}
];

let movies = [
    {
        'Title': 'Star Wars',
        'Description': 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
        'Genre': {
            'Name': 'Sci-Fi',
            'Description': 'A fictionalized story wherein the setting and plot are centered around technology, time travel, outer space, or scientific principles, with or without the presence of aliens.'
        },

        'Director': {
            'Name': 'George Lucas',
            'Bio': 'American film director, producer, screenwriter, and entrepreneur. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, and Industrial Light & Magic.',
            'Birth': 1944
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/Star_Wars#/media/File:Star_wars2.svg',
        'Featured': false,
        Year: 1977
    },

    {
        'Title': 'Warrior',
        'Description': 'The youngest son of an alcoholic former boxer returns home, where he\'s trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.',
        'Genre': {
            'Name': 'Action',
            'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
        },

        'Director': {
            'Name': 'Gavin O\'Connor',
            'Bio': 'American film director, screenwriter, producer, playwright, and actor. He is best known for directing the films Miracle, Warrior, The Accountant, and The Way Back.',
            'Birth': 1963
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/Warrior_(2011_film)#/media/File:Warrior_Poster.jpg',
        'Featured': false,
        Year: 2011
    },

    {
        'Title': 'Tropic Thunder',
        'Description': 'Through a series of freak occurrences, a group of actors shooting a big-budget war movie are forced to become the soldiers they are portraying.',
        'Genre': {
            'Name': 'Comedy',
            'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
        },

        'Director': {
            'Name': 'Ben Stiller',
            'Bio': 'American actor, comedian, and filmmaker. His films have grossed more than $2.6 billion in Canada and the United States, with an average of $79 million per film.[2] Throughout his career, he has received various awards and honors, including an Emmy Award, multiple MTV Movie Awards, a Britannia Award and a Teen Choice Award.',
            'Birth': 1965
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/Tropic_Thunder#/media/File:Tropic_thunder_ver3.jpg',
        'Featured': false,
        Year: 2008
    },

    {
        'Title': 'Hercules',
        'Description': 'The son of Zeus and Hera is stripped of his immortality as an infant and must become a true hero in order to reclaim it.',
        'Genre': {
            'Name': 'Comedy',
            'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
        },

        'Director': {
            'Name': 'John Musker',
            'Bio': 'American animator, film director, screenwriter, and film producer. He often collaborates with fellow director Ron Clements and is best known for writing and directing the Disney films The Great Mouse Detective (1986), The Little Mermaid (1989), Aladdin (1992), Hercules (1997), Treasure Planet (2002), The Princess and the Frog (2009), and Moana (2016).',
            'Birth': 1953
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/Hercules_(1997_film)#/media/File:Hercules_(1997_film)_poster.jpg',
        'Featured': false,
        Year: 1997
    },

    {
        'Title': '300',
        'Description': 'King Leonidas of Sparta and a force of 300 men fight the Persians at Thermopylae in 480 B.C.',
        'Genre': {
            'Name': 'Action',
            'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
        },

        'Director': {
            'Name': 'Zack Snyder',
            'Bio': 'American film director, film producer, and screenwriter, best known for action and science fiction films.',
            'Birth': 1966
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/300_(film)#/media/File:300poster.jpg',
        'Featured': false,
        Year: 2007
    },

    {
        'Title': 'The Wolf of Wall Street',
        'Description': 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
        'Genre': {
            'Name': 'Drama',
            'Description': 'A genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },

        'Director': {
            'Name': 'Martin Scorsese',
            'Bio': 'American film director, producer, screenwriter and actor. He is the recipient of many accolades, including an Academy Award, three Primetime Emmy Awards, a Grammy Award, four British Academy Film Awards, three Golden Globe Awards, and two Directors Guild of America Awards.',
            'Birth': 1942
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/The_Wolf_of_Wall_Street_(2013_film)#/media/File:The_Wolf_of_Wall_Street_(2013).png',
        'Featured': false,
        Year: 2013
    },

    {
        'Title': 'Talladega Nights',
        'Description': 'Number one NASCAR driver Ricky Bobby stays atop the heap thanks to a pact with his best friend and teammate, Cal Naughton, Jr. But when a French Formula One driver, makes his way up the ladder, Ricky Bobby\'s talent and devotion are put to the test.',
        'Genre': {
            'Name': 'Comedy',
            'Description': 'A genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
        },

        'Director': {
            'Name': 'Adam McKay',
            'Bio': 'American film director, producer, screenwriter, and comedian. He rose to fame in the 2000s for his collaborations with comedian Will Ferrell and co-wrote his comedy films Anchorman, Talladega Nights, and The Other Guys.',
            'Birth': 1968
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/Talladega_Nights:_The_Ballad_of_Ricky_Bobby#/media/File:Talladega_nights.jpg',
        'Featured': false,
        Year: 2006
    },


    {
        'Title': 'The Patriot',
        'Description': 'Peaceful farmer Benjamin Martin is driven to lead the Colonial Militia during the American Revolution when a sadistic British officer murders his son.',
        'Genre': {
            'Name': 'Action',
            'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
        },

        'Director': {
            'Name': 'Roland Emmerich',
            'Bio': 'German film director, screenwriter, and producer. He is widely known for his science fiction and disaster films and has been called a "master of disaster" within the industry.',
            'Birth': 1955
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/The_Patriot_(2000_film)#/media/File:Patriot_promo_poster.jpg',
        'Featured': false,
        Year: 2000
    },

    {
        'Title': 'V For Vendetta',
        'Description': 'In a future British dystopian society, a shadowy freedom fighter, known only by the alias of "V", plots to overthrow the tyrannical government - with the help of a young woman.',
        'Genre': {
            'Name': 'Action',
            'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
        },

        'Director': {
            'Name': 'James McTeigue',
            'Bio': 'Australian film and television director. He has been an assistant director on many films, including Dark City (1998), the Matrix trilogy and Star Wars: Episode II Attack of the Clones (2002), and made his directorial debut with the 2005 film V for Vendetta to critical acclaim.',
            'Birth': 1967
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/V_for_Vendetta_(film)#/media/File:Vforvendettamov.jpg',
        'Featured': false,
        Year: 2006
    },

    {
        'Title': 'The Punisher',
        'Description': 'An undercover FBI agent becomes a vigilante and sets out to unleash his wrath upon the corrupt businessman who slaughtered his entire family at a reunion.',
        'Genre': {
            'Name': 'Action',
            'Description': 'Action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting.'
        },

        'Director': {
            'Name': 'Jonathan Hensleigh',
            'Bio': 'American screenwriter and film director, working primarily in the action-adventure genre, best known for writing films such as Jumanji, Die Hard with a Vengeance, and Armageddon.',
            'Birth': 1959
        },
        'ImageUrl': 'https://en.wikipedia.org/wiki/The_Punisher_(2004_film)#/media/File:Punisher_ver2.jpg',
        'Featured': false,
        Year: 2004
    },
    
];

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('Users need names')
    }
})

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('No such user')
    }
})

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('No such user')
    }
})

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle );
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('No such user');
    }
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        users = users.filter( user => user.id != id );
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('No such user');
    }
})

app.get('/', (req, res) => {
    res.send('Welcome to my myFlix API!');
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie)
    } else {
        res.status(400).send('No such movie')
    }
})

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre)
    } else {
        res.status(400).send('No such genre')
    }
})

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director)
    } else {
        res.status(400).send('No such director')
    }
})

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong.')
})

app.listen(8080, () => console.log('Your app is listening on port 8080.'));