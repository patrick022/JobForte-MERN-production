import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  // -----------JWT TOKEN IMPLEMENTATION-----------
  // const authHeader = req.headers.authorization;

  // //CHECKS DURING REQUEST IF HAD HEADER AND WITH BEARER
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   throw new UnauthenticatedError("Authentication Invalid");
  // }

  // const token = authHeader.split(" ")[1];
  // -----------JWT TOKEN IMPLEMENTATION-----------

  const token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);

    // attach the user request object id
    req.user = { userId: payload.userId };

    //FOR THE DEMO USER
    const testUser = payload.userId === "649d4777803a28f5de0200b0";

    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

export default auth;
