import express from "express";
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController.js";

//TEST USER DEMO MIDDLEWARE
import testUser from "../middleware/testUser.js";

router.route("/").post(testUser, createJob).get(getAllJobs);
// REMEMBER ABOUT :id
router.route("/stats").get(showStats);
router.route("/:id").delete(testUser, deleteJob).patch(testUser, updateJob);

export default router;
