const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const params = {
    types: undefined,
    offset: undefined,
    limit: undefined
}

router
    .get('/api/events', (req, res) => {

        const stream = fs.createReadStream(path.resolve('./data/events.json'));
        res.header("Content-Type", "text/cache-manifest");

        params.types = req.query.type ? req.query.type.split(':') : null;
        params.offset = req.query.offset && req.query.offset > 0 ? +req.query.offset : 0;
        params.limit = req.query.limit && req.query.limit > 0 ? +params.offset + +req.query.limit : undefined;

        if (req.query.type || req.query.offset || req.query.limit) {
            sendData(stream, params, res);
        } else {
            stream.pipe(res);
        }
    })
    .post('/api/events', (req, res) => {

        const stream = fs.createReadStream(path.resolve('./data/events.json'));
        res.header("Content-Type", "text/cache-manifest");

        params.types = req.body.type ? req.body.type.split(':') : null;
        params.offset = req.body.offset && req.body.offset > 0 ? +req.body.offset : 0;
        params.limit = req.body.limit && req.body.limit > 0 ? +params.offset + +req.body.limit : undefined;

        if (req.body.type || req.body.offset || req.body.limit) {
            sendData(stream, params, res);
        } else {
            stream.pipe(res);
        }
    });

function sendData(stream, params, res) {
    let chunks = [];

    stream.on('data', function(record) {
        if (params.types) {
            chunks = JSON.parse(record).events.filter(el =>
                params.types.includes(el.type));
        } else {
            JSON.parse(record).events.forEach(element => {
                chunks.push(element);
            });
        }
    });
    stream.on('error', () => {
        console.log('error reading stream');
    })
    stream.on('end', function() {
        if (chunks.length) {
            res.send(JSON.stringify(chunks.slice(params.offset, params.limit)));
        } else {
            res.status(400).send('incorrect type');
        }
    });
}

module.exports = router;