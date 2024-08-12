import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      require: true
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Account = models.Account || mongoose.model("Account", userSchema, 'account');
export default Account;
