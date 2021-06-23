const User = require("./models/user");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    "local",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.comparePassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        email: user.email,
      };
      done(err, userInformation);
    });
  });
};
