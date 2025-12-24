import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;


let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}


/**
 * Establishes and returns a shared Mongoose connection, creating and caching it on first use.
 *
 * @returns The connected Mongoose instance stored in the module-level cache.
 * @throws Error if the `MONGODB_URI` environment variable is not defined.
 * @throws Any error encountered while attempting to connect to MongoDB (the cached connection promise is cleared on failure).
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }
    const options = {
      bufferCommands: false, 
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;