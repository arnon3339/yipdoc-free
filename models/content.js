import mongoose, { Schema, models } from "mongoose";

mongoose.Schema.Types.String.checkRequired(v => v != null);
const contentSchema = new Schema(
  {
    date: {
      type: Schema.Types.Date,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      require: true
    },
    description: {
      type: String,
      required: false,
    },
    urFiles: {
      type: [String],
      require: true
    },
    reFiles: {
      type: [String],
      require: true
    },
    status: {
      type: Number,
      require: true
    },
    userID: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Content = models.Content|| mongoose.model("Content", contentSchema, 'content');
export default Content;
