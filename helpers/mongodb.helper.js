// Mongodb helper use mongoose to connect to the database and return the connection instance.
const mongoose = require('mongoose')
const config = require('../config')
let databaseInstance = null

 const CONNECT_DB = async () => {
    const url =config.mongoUri
    try {
        mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
      const dbConnection = mongoose.connection;
      dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
      });
     
      dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
      });
      return dbConnection;
}

 const GET_DB = () => {
    if (!databaseInstance) {
        throw new Error('Database not connected')
    }
    return databaseInstance
}

module.exports =  {
    CONNECT_DB,
    GET_DB
}
