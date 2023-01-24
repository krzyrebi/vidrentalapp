// trzeba poprawic JOI, bo nie dziala

const mongoose = require('mongoose') 
const express = require('express')
const router = express.Router()
const Joi = require('joi')

// router.use(express.json())
// router.use(express.text())
// router.use(express.raw())


// 1.tworzymy schema

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

// 2. tworzymy model
const Genre = mongoose.model('Genre', genreSchema)     // mozemy po prostu tutaj wstawic caly kod, ktory jest wyzej, tzn genresschema=...


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
    res.send(genres);
});

router.post('/', async (req, res) => {
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

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

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findOneAndRemove(req.params.id)

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.get('/:id', async (req, res) => {    // to jest router do pobrania pojedynczego genre
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

// function validateGenre(genre) {
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(genre, schema);
// }

module.exports = router