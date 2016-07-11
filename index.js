var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('index', { title: 'tonr'});
});

app.listen(process.env.PORT || 3000);