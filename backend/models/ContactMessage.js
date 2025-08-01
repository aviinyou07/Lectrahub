const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    university: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "replied", "archived"],
      default: "pending"
    },
    adminReply: { type: String, default: "" },
    repliedBy: { type: String, default: "" },
    repliedAt: { type: Date }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
