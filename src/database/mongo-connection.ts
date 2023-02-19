import mongoose from "mongoose";

/**
 * Database connection manager
 */
class MongoConnection {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async connect() {
    try {
      mongoose.set("strictQuery", true);
      await mongoose.connect(this.url);
      console.log("Database connection successful");
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Database disconnection error:", error);
    }
  }
}

export default MongoConnection;
