const router = require("express").Router();
const passport = require("passport");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post(
  "/sign-up",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/sign-up",
    failureFlash: true,
  })
);

router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});

router.post(
  "/sign-in",
  passport.authenticate("local-signin", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureFlash: true,
  })
);

router.get("/", isAuthenticated, (req, res, next) => {
  res.render("");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

module.exports = router;
