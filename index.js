var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('welcome to tonr');
});

app.listen(process.env.PORT || 3000);