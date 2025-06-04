import { model, Schema } from "mongoose";
import { IAdmin } from "../types";
import { Hash } from "../services";

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  const document = this;

  if (!document.isModified("password")) return next();
  document.password = await Hash.generate(document.password.toString());
  next();
});

adminSchema.methods.comparePasswords = async function (
  candidatePassword: string
) {
  const document = this;

  const isMatch = await Hash.validate(candidatePassword, document.password);
  return isMatch;
};

const documentModel = model("Admin", adminSchema);

async function create(admin: IAdmin) {
  const document = await documentModel.create(admin);
  return document;
}

async function get(email: string) {
  const document = await documentModel.findOne(
    { email },
    {
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  );
  return document;
}

export default { create, get };
