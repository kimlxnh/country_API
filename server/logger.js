//middleware that logs the http method being used, and the endpoint of the request coming from
// each login request that's coming in, this is the js that gets executed.

const logger = (req, res, next) => {
    console.log(req.method, req.originalUrl) //coming from client. form has method of POST, when they submit they get the method. only displayed to us on terminals.
    next()
}

module.exports = logger



