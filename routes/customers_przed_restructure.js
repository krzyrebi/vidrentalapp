// trzeba poprawic JOI, bo nie dziala

const mongoose = require('mongoose') 
const express = require('express')
const router = express.Router()
const Joi = require('joi')

// router.use(express.json())
// router.use(express.text())
// router.use(express.raw())


// 1.tworzymy schema

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

// 2. tworzymy model
const Customer = mongoose.model('Customer', customerSchema)     // mozemy po prostu tutaj wstawic caly kod, ktory jest wyzej, tzn genresschema=...


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')    // sort jest opcjonalnie, autor chce zeby wynik byl posortowany wg nazwy genre
    res.send(customers);
});

router.post('/', async (req, res) => {
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({     // mozna tu dac const, ale wtedy nizej trzebaby dac nowa zmienna zamiast genre = await...
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }) 
    customer = await customer.save()
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body.name)
    console.log(req.params.id)

    const customer = await Customer.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {new: true})
    // znajdz dokument o zadanym id, i podmien nazwe na podane w requescie; ostatni argument to options object (to get the updated object from database?)

    if (!customer) return res.status(404).send('The genre with the given ID was not found.');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findOneAndRemove(req.params.id)

    if (!customer) return res.status(404).send('The genre with the given ID was not found.');

    res.send(customer);
});

router.get('/:id', async (req, res) => {    // to jest router do pobrania pojedynczego genre
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The genre with the given ID was not found.');
    res.send(customer);
});

// function validateGenre(genre) {
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(genre, schema);
// }

module.exports = router