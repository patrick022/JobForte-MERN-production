import express from "express";
const router = express.Router();

import { checkUserPost } from "../controllers/checkController.js";

router.route("/").post(checkUserPost);

export default router;
