// trzeba poprawic JOI, bo nie dziala

const {Genre} = require('../models/genre') 
const {Movie, validate} = require('../models/movie') 
const mongoose = require('mongoose') 
const express = require('express')
const router = express.Router()



router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
    res.send(movies);
});

router.post('/', async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOne({genre: req.body.genre})         //  !!!!!! dlaczego genreID? importowane z validate movies?
    if (!genre) return res.status(400).send('Invalid Genre')        // sprawdzamy czy podano wlasciwa kategorie filmu w requescie

    const movie = new Movie({    
        title: req.body.title,
        genre: {
            _id: genre._id,            // tutaj chodzi o to, zeby nie ladowac calego obiektu genre, wystarczy nam name i id; w duzej aplikacji mogloby byc znacznie wiecej propert
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }) 
    await movie.save()
    res.send(movie);
});

router.put('/:id', async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findOneAndUpdate({_id: req.params.id},
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true });

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findOneAndRemove(req.params.id)

    if (!movie) return res.status(404).send('The genre with the given ID was not found.');

    res.send(movie);
});

router.get('/:id', async (req, res) => {    // to jest router do pobrania pojedynczego movie
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The genre with the given ID was not found.');
    res.send(movie);
});


module.exports = router