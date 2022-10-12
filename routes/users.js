const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { check, validationResult, body } = require("express-validator")

router.get('/register', function (req, res) {
  res.render("pages/register", { title: "Registratsiya" });
});

router.get('/login', function (req, res) {
  res.render("pages/login", { title: "Login" });
});

router.post("/register", [
  check("name").isLength({ min: 3, max: 50 }).withMessage("ismingiz 3 harfdan kam bulmasin").notEmpty().withMessage("Ismingizni kirgizing"),
  check("email").isEmail().withMessage("Noto'g'ri email").normalizeEmail(),
  check("password").isLength({ min: 8, max: 15 }).withMessage("Parol 8-15 belgi oralig'ida bo'lishi kerak").matches(/\d/).withMessage("Your password should have at least one number").matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Parolda maxsus !@#$% belgilar ishtirok etishi kerak"),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      console.log(req.body.password, req.body.confirmPassword);
      throw new Error("Tasdiqlangan parol parolga tug'ri kelmadi");
    }
    return true
  })
], async (req, res) => {

  let errors = validationResult(req);

  let handleError = !errors.isEmpty();

  if (handleError) {
    res.render("pages/register", { errors: errors.errors })
    console.log({ errors: errors.errors });
  }
  else {

    const { name, email, password } = req.body
    const checkEmail = await User.findOne({ email })

    if (checkEmail) {
      throw new Error("Kechirasiz bunday emaillik foydalanuvchi ruyhatdan o'tgan")
    }
    else {
      const user = new User({ name, email, password })

      user.save((err) => {
        if (err) throw err;
        else
        req.flash("alert alert-success", "Ruyhatdan utdingiz");
        res.redirect("/login")
      })
    }
  }


})

module.exports = router;

