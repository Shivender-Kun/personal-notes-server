import { NextFunction, Request, RequestHandler, Response } from "express";
import { DEFAULT_PAGINATION_LIMIT } from "../constants";
import { StatusCodes } from "http-status-codes";
import { Note } from "../models";
import mongoose from "mongoose";

const addNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId: userRef } = res.locals;
  const { title, content, labels, bgColor, isPinned } = req.body;
  const note = { title, content, labels, userRef, bgColor, isPinned };

  try {
    const noteAdded = await Note.create(note);

    if (noteAdded)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note added successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to add note" });
  } catch (error) {
    next(error);
  }
};

const updateNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const note = { ...req.body };
  delete note.id;

  try {
    const noteUpdated = await Note.update(id, note);

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note updated successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update note" });
  } catch (error) {
    next(error);
  }
};

const notesList: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      pagination: { page, limit, offset },
      query: { archived, deleted },
    } = res.locals;

    let notes,
      hasMore = false;

    if (!archived && !deleted) {
      notes = await Note.model.aggregate([
        {
          $match: {
            userRef: mongoose.Types.ObjectId.createFromHexString(userId),
            isDeleted: false,
            isArchived: false,
          },
        },
        {
          $facet: {
            ...(page === 1 && {
              pinned: [
                { $match: { isPinned: true } },
                { $sort: { updatedAt: -1 } },
                { $limit: DEFAULT_PAGINATION_LIMIT }, // cap pinned items
                {
                  $lookup: {
                    from: "labels",
                    localField: "labels",
                    foreignField: "_id",
                    as: "labels",
                  },
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    bgColor: 1,
                    isPinned: 1,
                    isArchived: 1,
                    isDeleted: 1,
                    updatedAt: 1,
                    createdAt: 1,
                    labels: {
                      $map: {
                        input: "$labels",
                        as: "label",
                        in: {
                          _id: "$$label._id",
                          name: "$$label.name",
                        },
                      },
                    }, // Include labels in the pinned notes
                  },
                },
              ],
            }),
            unpinned: [
              { $match: { isPinned: false } },
              { $sort: { updatedAt: -1 } },
              { $skip: offset },
              { $limit: limit + 1 }, // fetch one extra to determine `hasMore`
              {
                $lookup: {
                  from: "labels",
                  localField: "labels",
                  foreignField: "_id",
                  as: "labels",
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  content: 1,
                  bgColor: 1,
                  isPinned: 1,
                  isArchived: 1,
                  isDeleted: 1,
                  updatedAt: 1,
                  createdAt: 1,
                  labels: {
                    $map: {
                      input: "$labels",
                      as: "label",
                      in: {
                        _id: "$$label._id",
                        name: "$$label.name",
                      },
                    },
                  }, // Include labels in the unpinned notes
                },
              },
            ],
          },
        },
      ]);

      const { pinned, unpinned } = notes[0] || [[], []];
      hasMore = unpinned.length > limit;
      if (hasMore) unpinned.pop(); // Remove the last item if it exceeds the limit

      // Combine pinned and unpinned notes
      // Pinned notes are always at the top, followed by unpinned notes
      notes = pinned ? pinned.concat(unpinned) : unpinned;
    } else if (archived || deleted) {
      notes = await Note.model.aggregate([
        {
          $match: {
            userRef: mongoose.Types.ObjectId.createFromHexString(userId),
            isArchived: archived,
            isDeleted: deleted,
          },
        },
        {
          $facet: {
            list: [
              { $match: { isArchived: archived, isDeleted: deleted } },
              { $sort: { updatedAt: -1 } },
              { $skip: offset },
              { $limit: limit + 1 },
              {
                $lookup: {
                  from: "labels",
                  localField: "labels",
                  foreignField: "_id",
                  as: "labels",
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  content: 1,
                  bgColor: 1,
                  isPinned: 1,
                  isArchived: 1,
                  isDeleted: 1,
                  updatedAt: 1,
                  createdAt: 1,
                  labels: {
                    $map: {
                      input: "$labels",
                      as: "label",
                      in: {
                        _id: "$$label._id",
                        name: "$$label.name",
                      },
                    },
                  }, // Include labels in the pinned notes
                },
              },
            ],
          },
        },
      ]);

      notes = notes[0].list || [];
      hasMore = notes.length > limit;
      if (hasMore) notes.pop(); // Remove the last item if it exceeds the limit
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid query parameters" });
    }

    if (notes) {
      return res.status(StatusCodes.OK).json({
        message: "Notes fetched successfully",
        data: { list: notes, page, limit, hasMore },
      });
    }
  } catch (error) {
    next(error);
  }
};

const pinNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isPinned: true,
      isArchived: false,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note pinned successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to pin note" });
  } catch (error) {
    next(error);
  }
};

const unpinNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isPinned: false,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note unpinned successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to unpin note" });
  } catch (error) {
    next(error);
  }
};

const archiveNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isPinned: false,
      isArchived: true,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note archived successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to archive note" });
  } catch (error) {
    next(error);
  }
};

const unarchiveNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isArchived: false,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note unarchived successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to unarchive note" });
  } catch (error) {
    next(error);
  }
};

const deleteNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isDeleted: true,
      isArchived: false,
      isPinned: false,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note deleted successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete note" });
  } catch (error) {
    next(error);
  }
};

const deleteNotePermanently: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteRemoved = await Note.remove(id);

    if (noteRemoved)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note deleted permanently" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete note permanently" });
  } catch (error) {
    next(error);
  }
};

const restoreNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noteUpdated = await Note.update(id, {
      isDeleted: false,
    });

    if (noteUpdated)
      return res
        .status(StatusCodes.OK)
        .json({ message: "Note restored successfully" });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to restore note" });
  } catch (error) {
    next(error);
  }
};

export default {
  addNote,
  updateNote,
  notesList,
  pinNote,
  unpinNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  restoreNote,
  deleteNotePermanently,
};
