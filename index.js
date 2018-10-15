const express = require('express');
const app = express();
const port = 8000;
const startingDate = new Date();

app.all('/status', (req, res) => {
    let diff = getDiffBetweenDates(startingDate, new Date());
    res.send(msToReadableTime(diff));
})

app.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, () => console.log(`Working on port ${port}`));


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