// const config = require('config')
// const jwt = require('jsonwebtoken')   // po przeniesieniu tworzenia tokenow do user.js juz tego nie potrzebujemy tutaj
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose') 
const {User} = require('../models/user') // usuwamy import validate, bo teraz potrzebujemy inej funkcji validate
const express = require('express')
const router = express.Router()



router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Invalid email or password')   // jesli nie ma takiergo adresu email, to invalid... dajemy status 400 a nie 404, boi nie chcemy mowic userowi, czy zle haslo, czy email
    

    const validPassword = await bcrypt.compare(req.body.password, user.password)    // porownujemy haslo wprowadzone z zhaszowanym; user.password zawiera salt, bcrypt go potrzebuje do porownania
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))    // to przenioslem do user.js
    // metoda sign zwraca token
    // pierwszy argument to payload, drugi argument to secret/private key
    // NIGDY nie trzymac tutaj private key, lepiej w environment variable; tutaj mamy tylko nazwe naszego ustawienia aplikacji, tzn jwtPrivateKey, sama wartosc jest w environment variables

    
    res.send(token)
    // zwracamy token do klienta

});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()        // walidujemy przy logowaniu tylko email i haslo
    })

    return schema.validate(req);
}

module.exports = router