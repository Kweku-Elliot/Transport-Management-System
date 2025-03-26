const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors()); // This Fixes CORS issue
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes); //  Mount auth routes correctly
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));