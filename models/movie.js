const mongoose = require('mongoose') 
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)  
const {genreSchema} = require('./genre')      // !!!!!!!!! laduje, bo bedzie mi potrzebne do zagniezdzonego dokumentu?

// 1.tworzymy schema

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,           // !!!!!!!!!!!
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

// 2. tworzymy model
const Movie = mongoose.model('Movie', movieSchema)     // mozemy po prostu tutaj wstawic caly kod, ktory jest wyzej, tzn genresschema=...

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    })
  
    return schema.validate(movie);
  }


module.exports.Movie = Movie
module.exports.validate = validateMovie
