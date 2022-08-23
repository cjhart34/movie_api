const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, require: true},
    Description: {type: String, require: true},
    Genre: {
        Name: String,
        Description: String
    }, 
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean,
    Year: Number
});

let genreSchema = mongoose.Schema({
    Name: String,
    Description: String
});

let directorSchema = mongoose.Schema({
    Name: String,
    Description: String
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema)
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
