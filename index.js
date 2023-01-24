require('express-async-errors')
const error = require('./middleware/error')
const logger = require('./logger')
// musimy sie upewnic ze przy starcie aplikacji nasza environment variable jest set, bo inaczej authentication endpoint nie bedzie dzialac 
const mongoose = require('mongoose')        // load mongoose
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const express = require('express')
const cors = require('cors')
const app = express()




process.on('uncaughtException', (ex) => {
    console.log('We got uncaught exception')
    logger.error(ex.message)
    process.exit(1)
})
// metoda on; w node mamy event o nazwie uncaughtException - that event is raised, kiedy mamy exception w node process, ale nie obsluzylismy nigdzie z catch block
// to zadziala tylko z synchronicznym kodem, nie zadziala z rejected promise

// poniezj sposob na rejested promises
process.on('unhandledRejection', (ex) => {
    console.log('We got unhandled rejection')
    logger.error(ex.message)
    process.exit(1)
})

// jako best practice, w przypadku unhandledRejection albo uncaughtException powinnismy exit process, i go zrestrtowac; jak to zrobic w produkcji? sa jakies process managery


// throw new Error('Something failed during startup')   // do testowania process.on...

// const p = Promise.reject(new Error('Something failed miserably'))
// .then(() => console.log('Done')) // do testowania unhandled rejection


if (!config.get('jwtPrivateKey')) {
    console.error('Fatal error: jwtPrivateKey is not defined')
    process.exit(1)
    // tutaj mowimy, ze jesli jwtprivatekey nie jest ustalone (environment variable), to zakoncz proces
}

//  zeby to dzialalo, to ustalamy w terminalu environment variable:
// export vidly_jwtPrivateKey=mySecureKey
//  albo setx jwtPrivateKey mySecureKey  ??


mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://mongo_test:XEtYIL5Jw3GVUKnZ@cluster0.jqpf2pe.mongodb.net/second_test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to Mongodb'))
    .catch(err => console.error('Could not connect to Mongodb', err))

 
// UWAGA!!!! w powyzszej sciezce second_test to nazwa bazy danych w atlasie; jesli nizc tam nie dam, to domyslnie bedzie baza danych o nazwie test


app.use(express.json())
app.use(cors())
app.use('/api/genres', genres)  // tutaj mowimy expressowi, zeby dla kazdych routes starting with api/genres, use the genres router, ten router handles requests skierowane do api/genres
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)


app.use(error)
// tutaj dajemy nasza error middleware function, przenieslismy ja do oddzielnego modulu middleware/error.js
// to dziala dzieki wywolaniu na gorze require('express-async-errors') - ten modul opakowanuje nasze route handlery (get, post, itd) w asynchroniczna funkcje, ktora obsluguje bledy
// taka, jak mamy w async.js - to jest slabsze rozwiazanie tego samego problemu; lepiej uzywac express-async-errors
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))