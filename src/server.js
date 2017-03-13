var express = require('express');
var app = express();

var superagent = require('superagent');

var fs = require('fs');

// CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);

app.use(express.static(__dirname));

app.get('/get/:url', function (req, res) {
    superagent.get(decodeURIComponent(req.params.url))
        .then(function (pres, err) {
            res.send(pres.text);
        });
});

var server = app.listen(3663, function () {
    console.log('Listening on port %d', server.address().port);
});
