const winston = require('winston')
const logger = require('../logger')

// ponizsza funkcja wylapuje wszystkie errory w request processing pipeline (czyli nie wylapuje np unhandledrejection)
// dlatego w index.js musimy ogarnac unhandledrejection i uncaughtexceptions

module.exports = function(err, req, res, next){
    // winston.log('debug', err.message)
    logger.log('debug', err.message)
    // logger.debug(err.message)  inny sposob na to samo
    //  ??

    res.status(500).send('Something failed')
        // status 500 = internal server error
}