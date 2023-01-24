const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)   // objectid jest metoda obiektu Joi; moge to wsadzic do index.js, i stamtad wyekspotowac, zeby zaladowac to tylko raz, i potem uzywac w roznych miejscach, ale na razie zostawilem to tutaj
const mongoose = require('mongoose')

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {     // nie pobieramy schema z customer.js, bo chcemy tylko wybrane property
    type: new mongoose.Schema({
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
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({    // nie pobieramy schema z movie.js, bo chcemy tylko wybrane property
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
    // tutaj ustalamy, co wlasciwie klient ma przeslac w requescie; no bo nie chcemy, zeby np sam przysylal cene wypozyczenia
    // objectid: zainstalowalismy joi-objectid - ktory obsluguje sprawdzanie objectid w joi
  })

  return schema.validate(rental);
}

exports.Rental = Rental; 
exports.validate = validateRental;