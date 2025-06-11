import { model, Schema, Types } from "mongoose";
import { Hash } from "../services";
import { IUser } from "../types";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    dob: { type: Date },
    profilePicture: { type: String, required: true },
    coverPicture: { type: String },
    isPrivate: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    // themeRef: { type: Schema.Types.ObjectId, ref: "Theme" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const document = this;

  if (!document.isModified("password")) return next();
  document.password = await Hash.generate(document.password.toString());

  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword: string
) {
  const document = this;

  const isMatch = await Hash.validate(candidatePassword, document.password);
  return isMatch;
};

const documentModel = model("User", userSchema);

async function create(user: IUser) {
  const document = new documentModel(user);
  const save = await document.save();
  return save;
}

async function get({
  id,
  email,
  resetPasswordToken,
}: {
  id?: string;
  email?: string;
  resetPasswordToken?: string;
}) {
  let document;
  if (id) {
    document = documentModel.findById(id, {
      password: 0,
      _id: 0,
      __v: 0,
      updatedAt: 0,
      resetPasswordExpires: 0,
      resetPasswordToken: 0,
      isDeleted: 0,
    });
  } else {
    document = documentModel.findOne(
      {
        ...(email && { email }),
        ...(resetPasswordToken && { resetPasswordToken }),
      },
      {
        __v: 0,
        updatedAt: 0,
        resetPasswordExpires: 0,
        resetPasswordToken: 0,
        isDeleted: 0,
      }
    );
  }
  return document;
}

async function update(_id: string | Types.ObjectId, user: IUser) {
  const data = { ...user };
  delete data.email;

  const document = documentModel.findByIdAndUpdate(_id, data, {
    new: true,
    password: 0,
    _id: 0,
    createdAt: 0,
    updatedAt: 0,
    resetPasswordExpires: 0,
    resetPasswordToken: 0,
    isDeleted: 0,
  });

  return document;
}

async function remove(_id: string) {
  const document = documentModel.findByIdAndUpdate(_id, { isDeleted: true });
  return document;
}

export default { create, get, update, remove };
