import { asyncHandler } from "../../utils/asyncHandler.js";

import { apiResponse } from "../../utils/apiResponse.js";

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    apiResponse({
      data: req.user,
    }),
  );
});
