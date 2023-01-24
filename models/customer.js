const mongoose = require('mongoose') 
const Joi = require('joi')

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


// function validateCustomer(customer) {
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(customer, schema);
// }

module.exports.Customer = Customer
// module.exports.validate = validateCustomer