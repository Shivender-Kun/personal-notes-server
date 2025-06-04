import { NextFunction, Request, Response } from "express";
import { DEFAULT_PAGINATION_LIMIT } from "../constants";

const pagination = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  let pageNumber = page ? Number(page) : 1;
  let limitNumber = limit ? Number(limit) : DEFAULT_PAGINATION_LIMIT;

  // Determine the route to set pagination parameters
  const route = req.baseUrl.split("/").pop();

  if (route === "notes") {
    const { archived, deleted } = req.query;

    res.locals.query = {
      archived: archived === "true",
      deleted: deleted === "true",
    };
  }

  const offset = (pageNumber - 1) * limitNumber;

  res.locals.pagination = {
    page: pageNumber,
    limit: limitNumber,
    offset,
  };

  next();
};

export default pagination;
