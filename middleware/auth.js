const jwt = require('jsonwebtoken')
const config = require('config')

function auth(req, res, next) {
    const token = req.header('x-auth-token')    // sprawdzamy czy w headerze requesta jest nasz custom token
    if (!token) return res.status(401).send('Access denied. No token provided')

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))    // ta metoda weryfikuje token z requesta, jesli zostanie zweryfikowany, to zwraca payload
        req.user = decoded
        next()        // przekazujemy kontrole nastepnej funkcji, w tym przypadku route handlerowi
    }
    catch (ex) {
        res.status(400). send('Invalid token')
    }
    
}

module.exports = auth