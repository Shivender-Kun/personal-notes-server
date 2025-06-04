import { model, Schema } from "mongoose";
import { ILabel } from "../types";

const labelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const documentModel = model("Label", labelSchema);

async function create(label: ILabel) {
  const document = new documentModel(label, { __v: 0 });
  const save = await document.save();
  return save;
}

async function find(userRef: string, offset: number, limit: number) {
  const document = documentModel
    .find(
      { userRef, isDeleted: false },
      { __v: 0, userRef: 0, createdAt: 0, updatedAt: 0 }
    )
    .sort("-createdAt")
    .skip(offset)
    .limit(limit);

  return document;
}

async function findAll(userRef: string) {
  const document = documentModel.find(
    { userRef },
    { __v: 0, userRef: 0, createdAt: 0, updatedAt: 0 }
  );
  return document;
}

async function update(id: string, label: ILabel) {
  const document = documentModel.findByIdAndUpdate(id, label, {
    new: true,
    __v: 0,
    userRef: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return document;
}

async function remove(id: string) {
  const document = documentModel.findByIdAndUpdate(id, {
    isDeleted: true,
  });
  return document;
}

export default { create, remove, find, findAll, update };
