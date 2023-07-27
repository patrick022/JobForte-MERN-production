import CheckUser from "../models/CheckUser.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const checkUserPost = async (req, res) => {
  const data = req.body;

  if (data) {
    await CheckUser.create(data);
  }

  res.status(StatusCodes.CREATED).json(data);
};

export { checkUserPost };
