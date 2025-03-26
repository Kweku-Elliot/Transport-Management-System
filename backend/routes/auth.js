const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

//  User Registration
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
            [name, email, hashedPassword, role]
        );

        res.json({ message: " User registered successfully", userId: result.insertId });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Database error" });
    }
});

//  User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        //  Send structured user data
        res.json({
            message: " Login successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;