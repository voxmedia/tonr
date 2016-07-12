var express = require('express');
var exphbs  = require('express-handlebars');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('index', { title: 'tonr' });
});

app.use(favicon(path.join(__dirname,'assets','images','favicon.ico')));

app.listen(process.env.PORT || 3000);