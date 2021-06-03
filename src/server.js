// Modulos
const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors')
const {config} = require('./config');

// Inicializacion del server
const app = express();
require('./database')
require('./passport/local-auth')

// Ajustes
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  console.log(app.locals)
  next();
});

app.use(cors(
  config.application.cors.server
))


// Rutas
app.use('/', require('./routes/index'))

// Server

app.listen(app.get('port'), ()=> {
	console.log('Server on port ', app.get('port'));
})