import { model, Schema } from "mongoose";
import { INote } from "../types";

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String },
    labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    bgColor: { type: String },
  },
  { timestamps: true }
);

const documentModel = model("Note", noteSchema);

async function create(note: INote) {
  const document = new documentModel(note, { __v: 0 });
  const save = await document.save();
  return save;
}

async function find(userRef: string, offset: number, limit: number) {
  const document = documentModel
    .find(
      { userRef, isDeleted: false, isArchived: false, isPinned: false },
      { __v: 0 }
    )
    .sort("-createdAt")
    .skip(offset)
    .limit(limit);

  return document;
}

async function findArchived(userRef: string, offset: number, limit: number) {
  const document = documentModel
    .find({ userRef, isArchived: true }, { __v: 0 })
    .sort("-createdAt")
    .skip(offset)
    .limit(limit);

  return document;
}

async function findDeleted(userRef: string, offset: number, limit: number) {
  const document = documentModel
    .find({ userRef, isDeleted: true }, { __v: 0 })
    .sort("-createdAt")
    .skip(offset)
    .limit(limit);

  return document;
}

async function findAll(userRef: string) {
  const document = documentModel
    .find({ userRef }, { __v: 0 })
    .sort("-createdAt");
  return document;
}

async function update(id: string, note: INote) {
  const document = documentModel.findByIdAndUpdate(id, note, {
    new: true,
  });

  return document;
}

async function remove(id: string) {
  const document = documentModel.findByIdAndUpdate(id, { isDeleted: true });
  return document;
}

export default {
  create,
  find,
  findDeleted,
  findArchived,
  findAll,
  update,
  remove,
  model: documentModel,
  schema: noteSchema,
};
