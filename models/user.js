const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose') 
const Joi = require('joi')

// 1.tworzymy schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true        // to jest po to, zeby sprawdzac, czy istnieje uzytkownik o danym adresie w bazie
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean
})

// teraz dodajemy methode w userSchema; trzeba dodac pare key-value, generateAuthToken to key
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
    // tutaj zmienilismy user na this, bo odnosimy sie do obiektu, do ktorego nalezy ta metoda; wiec tutaj nie mozemy uzyc fubnkcji strzalkowej, bo w niej nie ma this
    // _id: this._id, isAdmin: this.isAdmin   to jest payload
    return token
}

// 2. tworzymy model
const User = mongoose.model('User', userSchema)   


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()        // tutaj jest 255 a nie 1024, bo dopiero jak zhasszujemy haslo, to bedziemy potrzebowac wiecej miejsca
    })

    return schema.validate(user);
}


module.exports.User = User
module.exports.validate = validateUser
