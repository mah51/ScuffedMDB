import mongoose from 'mongoose';

const connection = { isConnected: false }; /* creating connection object*/
let uri = process.env.MONGODB_URI;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  let db;

  if (!connection.isConnected) {
    db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log('-----db isConnected-----');
  }
  return db; // IMPORTANT! -- return an instance of the db
}

export default dbConnect;
