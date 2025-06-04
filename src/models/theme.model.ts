import { model, Schema } from "mongoose";
import { ITheme } from "../types";

const backgroundColorSchema = { type: String, default: "#000000" };
const textColorSchema = { type: String, default: "#ffffff" };

const themeSchema = new Schema<ITheme>(
  {
    name: { type: String, required: true, unique: true },
    appBackgroundColor: backgroundColorSchema,
    menuBackgroundColor: backgroundColorSchema,
    appTextColor: textColorSchema,
    menuTextColor: textColorSchema,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const documentModel = model("Theme", themeSchema);

async function create(theme: ITheme) {
  const document = new documentModel(theme, { __v: 0 });
  const save = await document.save();
  return save;
}

async function get(themeId: string) {
  const document = documentModel.findById(themeId, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return document;
}

async function update(themeId: string, theme: ITheme) {
  const document = documentModel.findByIdAndUpdate(themeId, theme, {
    new: true,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return document;
}

async function remove(themeId: string) {
  const document = documentModel.findByIdAndUpdate(themeId, {
    isDeleted: true,
  });
  return document;
}

export default { create, get, update, remove };
