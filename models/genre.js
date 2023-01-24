const mongoose = require('mongoose') 
const Joi = require('joi')

// 1.tworzymy schema

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})

// 2. tworzymy model
const Genre = mongoose.model('Genre', genreSchema)     // mozemy po prostu tutaj wstawic caly kod, ktory jest wyzej, tzn genresschema=...

// function validateGenre(genre) {
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(genre, schema);
// }

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(genre);
}


module.exports.Genre = Genre
module.exports.validate = validateGenre
module.exports.genreSchema = genreSchema        //  !!! to mi potrzebne w module movie
