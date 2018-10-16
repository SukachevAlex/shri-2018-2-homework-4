const dataFile = require('./data/events.json');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 8000;
const startingDate = new Date();

app.all('/status', (req, res) => {
    let diff = getDiffBetweenDates(startingDate, new Date());
    res.send(msToReadableTime(diff));
})

app.route('/api/events')
    .get((req, res) => {
        const chunks = {
            events: []
        };
        const stream = fs.createReadStream(__dirname + '/data/events.json');
        res.header("Content-Type", "text/cache-manifest");

        if (req.query.type) {
            let types = req.query.type.split(':');
            stream.on('data', function(record) {
                JSON.parse(record).events.forEach(element => {
                    if (types.includes(element.type)) {
                        chunks.events.push(element);
                    }
                });
            });
            stream.on('error', () => {
                console.log('error reading stream');
            })
            stream.on('end', function() {
                if (chunks.events.length) {
                    res.send(JSON.stringify(chunks));
                } else {
                    res.status(400).send('incorrect type');
                }
            })
        } else {
            stream.pipe(res);
        }
    })
    .post((req, res) => {
        res.json(dataFile);
    });

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

app.listen(port, () => {
    console.log(`Working on port ${port}`);
});

function getDiffBetweenDates(startDate, curDate) {
    return curDate && startDate ? curDate.getTime() - startDate.getTime() : '';
}

function msToReadableTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    return [hours, minutes, seconds].map(function(el) {
        el = Math.floor(el).toString();
        return el.length == 1 ? '0' + el : el;
    }).join(':');
}