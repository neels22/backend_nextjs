import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionstate = mongoose.connection.readyState;

  // check if already connected
  if (connectionstate === 1) {
    console.log("already connected");
    return;
  }

  if (connectionstate === 2) {
    console.log("connecting.....");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (error: any) {
    console.log("eroor while connecting to db", error);
    throw new Error("error: ", error);
  }
};

export default connect;
