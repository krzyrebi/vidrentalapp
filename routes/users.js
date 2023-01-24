const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose') 
const {User, validate} = require('../models/user') 
const express = require('express')
const router = express.Router()


router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user).select('-password')
    res.send(user)
})
// get information on the current user
// najpierw auth, czyli sprawdzamy, czy user przysle valid web token, jesli nie przysle, to nie dojdzie do handlera async...
// req.user wezmiemy z web tokena
// -password znaczy, ze z responsa usuwamy haslo, tzn nie chcemy przesylac klientowi jego hasla


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('User already registered')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    // user = new User(_.pick(req.body, ['name', 'email', 'password']))   to samo co linijke wyzej, tylko w lodashu
    // hashujemy haslo, zobacz w hash_cwiczenie.js
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()
    // res.send(user);
    // przydaloby sie zmienic response dla klienta, mozna to zrobic recznie, np:
    // res.send({
    //     name: user.name...
    // }) 
    // ale uzyjemy lodasha

    // res.send(_.pick(user, ['_id', 'name', 'email']) )     // pick to metoda lodasha: bierzemy obiekt i tworzymy nowy obiekt, tylko z wybranymi propertami; mozemy to zrobic tak
    // ale tez mozemy wyslac do klienta jwt w headerze: - tak jest bardziej elegancko?

    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))  // mogloby byc tak, ale przenosimy tworzenie tokenow do user.js
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']) )

    // mozna powyzsze rozwiazanie zostawic tutaj, ale poniewaz obowiazuje zasada information expert principle, to za tworzenie tokenow powinien byc odpowiedzialny modul user, i tam wsadzimy ta funkcje
    // jak robimy custom header, to nazywamy go x-..., pierwzsym argumentem jest nazwa headera, a drum wartosc
});

module.exports = router