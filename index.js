const express = require('express');
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(require('./routes/status'));
app.use(require('./routes/events'));
app
    .use((req, res, next) => {
        const err = new Error('<h1>Page not found</h1>');
        res.status(404);
        next(err);
    })
    .use((err, req, res, next) => {
        res.status(err.status || 500);
        return res.send(`${err.message}`);
    });

app.listen(port, () => console.log(`Listening on ${ port }`))