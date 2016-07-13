var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var favicon = require('serve-favicon');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var app = express();

app.use(favicon(path.join(__dirname,'assets','images','favicon.ico')));

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
   res.render('index', {layout: 'layout'});
});

app.get('/demo', function (req, res) {
    res.render('index', {layout: 'demo'});
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
  secret: 'krtyfghbncdsp0290u3reyi1eEQGHBP9dwjiofdf',
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser(function(user, done) {
  var sessionUser = { _id: user._id, username: user.username }
  done(null, sessionUser)
});

passport.deserializeUser( (sessionUser, done) => {
  // The sessionUser object is different from the user mongoose collection
  // it's actually req.session.passport.user and comes from the session collection
  done(null, sessionUser)
})

passport.use(new TwitterStrategy({
  consumerKey: "i8EFTUjHFBYus6e4CdAMA6JrD",
  consumerSecret: "RU1OZPywU8poVwO8rR113ljH82dhNVerpW9brg4ILTAf5HwqRx",
  callbackURL: "/auth/twitter/callback"
}, function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(process.env.PORT || 3000);