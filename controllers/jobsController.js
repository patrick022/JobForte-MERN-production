import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

//-----------CREATE JOB-----------
const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//-----------GET ALL JOBS-----------
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search, searchCompany } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  //add stuff based on condition for sort, etc.
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (searchCompany) {
    queryObject.company = { $regex: searchCompany, $options: "i" };
  }

  //No await for chaining before returning
  let result = Job.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("position");
  }

  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  //initial mock data is 75
  // limit items: 10 10 10 10 10 10 10 5
  //        page: 1  2  3  4  5  6  7  8
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  //count total jobs associated with the user id
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

//-----------EDIT JOB-----------
const updateJob = async (req, res) => {
  const { id: jobId } = req.params; //from URL :id
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  // check permissions - Only creator can edit
  checkPermissions(req.user, job.createdBy);

  //findOneAndUpdate approach
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });

  //-----ALTERNATE WITHOUT MODEL HOOKS-----
  // job.position = position;
  // job.company = company;

  // await job.save();
  // res.status(StatusCodes.OK).json({ job });
};

//-----------DELETE JOB-----------
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params; //from URL :id

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  // check permissions - Only creator can delete
  checkPermissions(req.user, job.createdBy);

  await job.deleteOne({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

//-----------SHOW STATS-----------
const showStats = async (req, res) => {
  // Match all jobs by user then group by status
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    // console.log("acc", acc);
    // console.log("curr", curr);
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  //For default entry if empty
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  //Job by date
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        applications: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  //Refactored for clean return
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        applications,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, applications };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
