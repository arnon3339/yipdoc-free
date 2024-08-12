import mongoose, { Schema, models } from "mongoose";

mongoose.Schema.Types.String.checkRequired(v => v != null);
const fileSchema = new Schema(
  {
    pathname: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: false,
    },
    contentDisposition: {
      type: String,
      require: true
    },
    url: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

const Files = models.Files || mongoose.model("Files", fileSchema, 'file');
export default Files;

