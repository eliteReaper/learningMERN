const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/login/logout", authController.postLogout);
router.post(
  "/signup",
  body("email").isEmail().withMessage("Email Invalid"),
  body("password")
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage("Password Too Weak"),
  body("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) throw new Error("Passwords Have to Match");
    return true;
  }),
  authController.postSignup
);

module.exports = router;
