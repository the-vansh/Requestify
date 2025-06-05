const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Requestify');
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;