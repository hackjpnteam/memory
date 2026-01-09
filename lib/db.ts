import mongoose, { Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI環境変数が設定されていません");
  }
  return uri;
}

export async function connectDB(): Promise<Mongoose> {
  let cached = global.mongooseCache;

  if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(getMongoUri(), opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
