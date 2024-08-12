import mongoose from "mongoose";

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI

  try {
    await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'pyib',
    })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};
