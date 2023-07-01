import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachedCookies from "../utils/attachedCookies.js";

//Register method
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  if (password.length < 6) {
    throw new BadRequestError("Password must be 6 and above");
  }
  const user = await User.create({ name, email, password });

  const token = user.createJWT();

  attachedCookies({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    location: user.location,
  });
};

// Login method
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  //WILL INCLUDE PASSWORD TO THE RETURNED JSON
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  //REMOVE PASSWORD FIELD WHEN RETURNING
  user.password = undefined;

  attachedCookies({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Update User method
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  if (!name || !email || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({
    _id: req.user.userId,
  });

  if (lastName.length > 30) {
    throw new BadRequestError("Last name must not exceed 30 letters ");
  }

  if (location.length > 50) {
    throw new BadRequestError("Location must not exceed 50 letters");
  }

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  attachedCookies({ res, token });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

//GETTING USER DETAILS FOR COOKIE
const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { register, login, updateUser, getCurrentUser, logout };
