import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // request max limit
  message:
    "Too many requests from this IP address, please try again after 15 minutes",
});

import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

//TEST USER DEMO MIDDLEWARE
import testUser from "../middleware/testUser.js";

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/logout").get(logout);

//Restricted for members only
router.route("/updateUser").patch(authenticateUser, testUser, updateUser);

//For User cookies implementation
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

export default router;
