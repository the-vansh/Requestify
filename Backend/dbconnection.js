const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.PASS;
    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,  // optional depending on mongoose version
      // useCreateIndex: true,     // optional depending on mongoose version
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);  // Exit with failure so Render can restart or alert you
  }
};

module.exports = connectDB;
