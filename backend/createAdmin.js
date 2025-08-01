const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Admins");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "admin@admin.com" });
    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      email: "admin@admin.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin user created");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();

