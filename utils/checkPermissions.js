import { UnAuthorizedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log("CheckPermissions", requestUser, resourceUserId);
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnAuthorizedError(
    "Not authorized to access this route - Forbidden"
  );
};

export default checkPermissions;
