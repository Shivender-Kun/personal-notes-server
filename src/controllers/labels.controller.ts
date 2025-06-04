import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Label } from "../models";

const addLabel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const { userId } = res.locals;
  const label = { name, userRef: userId };

  try {
    const labelAdded = await Label.create(label);

    if (labelAdded)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Label added successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to add label" });
  } catch (error) {
    next(error);
  }
};

const updateLabel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const labelUpdated = await Label.update(id, { name });

    if (labelUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Label updated successfully" });

    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Label not found" });
  } catch (error) {
    next(error);
  }
};

const deleteLabel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const removeLabel = await Label.remove(id);

    if (removeLabel)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Label deleted successfully" });

    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Label not found" });
  } catch (error) {
    next(error);
  }
};

const labelsList: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    pagination: { page, limit, offset },
  } = res.locals;

  try {
    const labels = await Label.find(userId, offset, limit + 1);

    const hasMore = labels.length > limit;
    if (hasMore) labels.pop(); // Remove the last item if it exceeds the limit

    if (labels)
      return res.status(StatusCodes.OK).json({
        message: "Labels fetched successfully",
        data: { list: labels, page, limit, hasMore },
      });

    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No labels found" });
  } catch (error) {
    next(error);
  }
};

export default {
  addLabel,
  updateLabel,
  deleteLabel,
  labelsList,
};
