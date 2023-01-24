// trzeba poprawic JOI, bo nie dziala

// const asyncMiddleware = require('../middleware/async')  // to jest wersja bez express-async-errors
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require('mongoose') 
const {Genre, validate} = require('../models/genre') 
const express = require('express')
const router = express.Router()


// router.use(express.json())
// router.use(express.text())
// router.use(express.raw())



// moglbym zrobic tak jak nizej, ale lepiej przeniesc try-catch do oddzielnego modulu
// router.get('/', async (req, res, next) => {
//     try {
//         const genres = await Genre.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
//         res.send(genres);
//     }
//     catch (ex) {
//         next(ex)
//         // tutaj przekazujemy kontrole kolejnej funkcji middleware w naszym processing pipeline, w tym przypadku naszemu error handling middleware?
//         // pierwszym argumentem funkcji error handling w index.jx bedzie ex z powyzszej funkcji
//         // wazna jest kolejnosc w index.js? tzn najpierw jest obsluga routes i potem error handling, dlatego tutaj next skieruje nas do error handling
//     }
// });

// template naszej funkcji: przeniesiemy go do modulu async.js
// function asyncMiddleware(handler) {
//     return async (req, res, next) => {
//         try {
//             await handler(req, res)
//         }
//         catch(ex) {
//             next(ex)
//         }
//         // czyli tutaj zwracamy naszego request handlera, tzn funkcje
//     }   
// }


// moglbym to zrobic tak, z funkcja z modulu asyc, ale lepiej z npm express-async-errors
// router.get('/', asyncMiddleware(async (req, res) => {
//         const genres = await Genre.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
//         res.send(genres); 
// }));

router.get('/', async (req, res) => {
        const genres = await Genre.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
        res.send(genres); 
});

router.post('/', async (req, res) => {

    // przed async(req..)  powinienem wstawic jeszcze middleware auth, zeby tylko zalogowani uzytkownicy mogli dodawac genre, ale na razie to usunalem, potem ogarne
    // tutaj drugim argumentem jest middleware function, ktora ma zostac wykonana przed async (req, res), ktora tez jest middleware function
    // i to bedzie funkcja auth, ktora sprawdza, czy klient ma uprawnienia do tego route
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    const { value, error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    

    let genre = new Genre({     // mozna tu dac const, ale wtedy nizej trzebaby dac nowa zmienna zamiast genre = await...
        name: req.body.name
    }) 
    genre = await genre.save()
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body.name)
    console.log(req.params.id)

    let genre = await Genre.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {new: true})
    // znajdz dokument o zadanym id, i podmien nazwe na podane w requescie; ostatni argument to options object (to get the updated object from database?)

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    // [auth, admin] - funkcje middleware, beda wykonane w tej kolejnosci
    const genre = await Genre.findOneAndRemove(req.params.id)

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.get('/:id', async (req, res) => {    // to jest router do pobrania pojedynczego genre
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});


module.exports = router