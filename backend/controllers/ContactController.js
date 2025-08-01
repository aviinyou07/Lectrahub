const ContactMessage = require("../models/ContactMessage");

const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, university, subject, message } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Save to DB
    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      university,
      subject,
      message
    });

    res.status(201).json({ message: "Message submitted", data: newMessage });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✉️ Admin: Reply to a message
const sendEmail = require("../utills/mailer");

const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply, repliedBy } = req.body;

    // Step 1: Fetch message to get user email and original content
    const message = await ContactMessage.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Step 2: Send reply email to the user
    await sendEmail({
      from: `"${repliedBy || "Support"}" <${process.env.EMAIL_USER}>`,
      to: message.email, // user's email
      subject: `Reply to your message: ${message.subject || "No Subject"}`,
      text: `
Hi ${message.firstName},

Thanks for reaching out to us. Here’s our response to your message:

----------------------------
Your original message:
${message.message}

----------------------------
Our reply:
${adminReply}

Best regards,
${repliedBy || "Support Team"}
      `,
    });

    // Step 3: Update the message in the DB
    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      {
        status: "replied",
        adminReply,
        repliedBy,
        repliedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({ message: "Replied and email sent", data: updated });
  } catch (error) {
    console.error("Reply failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// 🧹 Admin: Delete message (optional)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await ContactMessage.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitContactForm,  getAllMessages,
  replyToMessage,
  deleteMessage };
