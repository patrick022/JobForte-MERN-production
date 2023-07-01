import { BadRequestError } from "../errors/index.js";

//FOR TEST USER DEMO
const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Test User Demo. Read Only!");
  }
  next();
};

export default testUser;
