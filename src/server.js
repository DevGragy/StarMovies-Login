// Modulos
const express = require("express");
// const path = require("path");
// const engine = require("ejs-mate");
// const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const User = require("./models/user");

// Inicializacion del server
const app = express();
require("./database");
// require("./passport/local-auth");

// Ajustes
app.set("port", process.env.PORT || 4000);
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", engine);
// app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({ origin: "https://starmoviesreact.netlify.app", credentials: true })
);
app.options("https://starmoviesreact.netlify.app", cors());
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://amore-vino.netlify.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  session({
    secret: 'mysecretsession',
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      sameSite: 'none',
      secure: true,
    },
  })
);
// app.use(cookieParser("mysecretsession"));
// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// app.use((req, res, next) => {
//   app.locals.signinMessage = req.flash("signinMessage");
//   app.locals.signupMessage = req.flash("signupMessage");
//   app.locals.user = req.user;
//   console.log(app.locals);
//   next();
// });

// Rutas
// app.use("/", require("./routes/index"));

app.post("/sign-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({ message: info.message });
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Succesfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post("/sign-up", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.status(409).json({ message: "Email already taken" });
    if (!doc) {
      const newUser = new User();
      newUser.email = req.body.email;
      newUser.password = newUser.encryptPassword(req.body.password);
      await newUser.save();
      res.status(201).json({ message: "New user created successfully" });
    }
  });
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.get("/logout", (req, res, next) => {
  req.logout();
  res.send("Sucessfully logout");
});

// Server
app.listen(app.get("port"), () => {
  console.log("Server on port ", app.get("port"));
});
