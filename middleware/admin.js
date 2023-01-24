
module.exports = function(req, res, next) {
    // zakladamy, ze ta funkcja bedzie po wczesniejszej authorization middleware function, ktora zwrocila req.user
    if (!req.user.isAdmin) res.status(403).send('Access denied')
    // 403 - status forbidden - czyli wiemy kim jestes, nie masz uprawnien
    next()
}

// zastossujemy ta funkcje w genres.js

