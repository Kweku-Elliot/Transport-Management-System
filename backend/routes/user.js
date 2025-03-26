const express = require("express");
const router = express.Router();
const db = require("../db");


//  Route to book transport
router.post("/book-transport", async (req, res) => {
    console.log(" Received booking request:", req.body);

    const { user_id, pickup_location, dropoff_location, date, time_slot_id, vehicle_id } = req.body;

    if (!user_id || !pickup_location || !dropoff_location || !date || !time_slot_id || !vehicle_id) {
        console.error(" Missing required booking fields!", req.body);
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const sql = `
            INSERT INTO bookings (user_id, pickup_location, dropoff_location, date, time_slot_id, vehicle_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [user_id, pickup_location, dropoff_location, date, time_slot_id, vehicle_id]);

        console.log(" Booking Successful:", result);
        res.json({ success: true, booking_id: result.insertId });

    } catch (err) {
        console.error(" Booking error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Retrieve bookings for a specific user
router.get("/bookings", async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const [results] = await db.query(
            `SELECT bookings.id, bookings.time_slot_id, vehicles.vehicle_no 
             FROM bookings 
             JOIN vehicles ON bookings.vehicle_id = vehicles.id
             WHERE bookings.user_id = ?`, 
            [user_id]
        );

        res.json({ bookings: results.length ? results : [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;