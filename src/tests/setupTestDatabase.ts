import mongoose from "mongoose";
import { db, server } from "../app";

/**
 * Make sure the system clean the collections under "-test" database, when running tests
 */
const setupTestDatabase = () => {
  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany({})
      )
    );
  });

  afterAll(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(
        async (collection) => await collection.deleteMany({})
      )
    );
    db.disconnect();
    server.close();
  });
};

export default setupTestDatabase;
