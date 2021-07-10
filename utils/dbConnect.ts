import mongoose from 'mongoose';
import movie from '../models/movie';
import user from '../models/user';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)

  if (!mongoose.models?.User) {
    user.schema;
  }
  if (!mongoose.models?.Movie) {
    movie.schema;
  }
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    return mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (e) {
    console.error(e);
  }
}

export default dbConnect;
