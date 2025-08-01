const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");
const domain = process.env.DOMAIN_URL;

const sendWelcomeEmail = async (email) => {
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="text-align: center; padding-bottom: 20px;">
      <img src="${domain}/Logo.png" alt="LectraHub Logo" style="max-width: 120px; margin-bottom: 10px;" />
      <h2 style="color: #1e293b;">Welcome to LectraHub!</h2>
    </div>
    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
      Hi there,
    </p>
    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
      Thanks for subscribing to LectraHub’s newsletter! We're excited to have you on board.
      You’ll now receive the latest course updates, expert tips, and industry insights—right in your inbox.
    </p>
    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
      If you have any questions or want to get in touch, just reply to this email—we’re always happy to help!
    </p>
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
    <p style="font-size: 14px; color: #64748b;">
      — The LectraHub Team
    </p>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 12px;">
      You're receiving this email because you subscribed at <a href="${domain}" style="color: #0ea5e9;">${domain}</a>. You can unsubscribe anytime.
    </p>
  </div>
`;

    await transporter.sendMail({
        from: `"LectraHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to LectraHub!",
        text: "Thanks for subscribing to LectraHub! You'll now receive updates, expert tips, and more.",
        html: htmlContent,
    });
};


exports.subscribeUser = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required." });
    }

    try {
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Already subscribed." });
        }

        const subscriber = new Subscriber({ email });
        await subscriber.save();

        await sendWelcomeEmail(email);

        res.status(200).json({ message: "Subscribed successfully." });
    } catch (err) {
        console.error("Subscription error:", err.message);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};

exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.status(200).json(subscribers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching subscribers." });
    }
};
