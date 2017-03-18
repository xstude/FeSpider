/**
 * @Author: Ke Shen <godzilla>
 * @Date:   2017-03-10 09:43:57
 * @Email:  keshen@sohu-inc.com
 * @Last modified by:   godzilla
 * @Last modified time: 2017-03-10 09:43:57
 */

var conf = {
    pullDir: 'resources' // the dir name
};

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var superagent = require('superagent');

var fs = require('fs');

var cssBeautify = require('js-beautify').css;
var htmlBeautify = require('js-beautify').html;

// CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

    next();
};

app.use(allowCrossDomain);

app.use(express.static(__dirname));

app.get('/get/:url', function (req, res) {
    var url = decodeURIComponent(req.params.url);
    console.log('get: ' + url);
    superagent.get(url)
        .then(function (pres, err) {
            res.send(pres.text);
        });
});

var trans = function (data) {
    var re = '', template;
    var style = cssBeautify(data.style);
    var html = data.html;
    switch (data.type) {
    case 'html':
        var i = '    ';
        template = `<!DOCTYPE html>\n<html>\n${i}<head>\n${i}${i}<meta charset="utf-8">\n${i}${i}<title>${data.name}</title>\n${i}${i}<style>\n${style}\n${i}${i}</style>\n${i}</head>\n${i}<body>\n${i}${html}\n</body>\n</html>`;
        re = htmlBeautify(template);
        break;
    case 'vue':
        template = `<template>${html}</template><style scoped>${style}</style>`;
        re = template;
        break;
    }
    return re;
};

var pathExists = function (path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

var mkDir = function (path) {
    if (!pathExists(path)) fs.mkdirSync(path, 0777);
};
mkDir(conf.pullDir);

var getNewFilePath = function (path, format) {
    var count = '';
    while (pathExists(path + count + '.' + format)) {
        count = count ? (count + 1) : 1;
    }
    return path + count + '.' + format;
};

app.post('/post', multipartMiddleware, function (req, res) {
    var data = JSON.parse(req.body.json);
    console.log('/post: ' + data.name + '.' + data.type);
    fs.writeFile(getNewFilePath(conf.pullDir + '/' + data.name, data.type), trans(data), function (err) {
        if (err) throw err;
    });
    res.json({
        code: 200,
        msg: 'success'
    });
});

var server = app.listen(3663, function () {
    console.log('Listening on port %d', server.address().port);
});
