const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://vs3943943:7K5YucFOzUIsVWEX@requestify.0clpe24.mongodb.net/');
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
