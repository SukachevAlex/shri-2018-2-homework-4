const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dataFile = require('../data/events.json');

router
    .get('/api/events', (req, res) => {
        const chunks = {
            events: []
        };
        const stream = fs.createReadStream(path.resolve('./data/events.json'));
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




module.exports = router;