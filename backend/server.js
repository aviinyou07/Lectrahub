const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config(); // Load .env

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authAdminLogin = require('./routes/AdminAuthRoutes')
app.use('/api/admin', authAdminLogin)

const universityRoutes = require('./routes/UniversityRoutes');
app.use('/api/universities', universityRoutes);

const courseRoutes = require('./routes/CoursesRoutes')
app.use("/api/courses", courseRoutes)

const branchRoutes = require("./routes/BranchRoutes");
app.use("/api/branches", branchRoutes);

const semesterRoutes = require("./routes/SemesterRoutes");
app.use("/api/semesters", semesterRoutes);

const subjectRoutes = require("./routes/SubjectRoutes");
app.use("/api/subjects", subjectRoutes);

const contentSectionRoutes = require("./routes/ContentRoutes");
app.use("/api/contents", contentSectionRoutes);

const subscriberRoutes = require("./routes/SubscriberRoutes");
app.use("/api", subscriberRoutes);

const contactRoutes = require("./routes/ContactsRoutes");
app.use("/api/contact", contactRoutes);







// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
