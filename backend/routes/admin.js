const express = require("express");
const router = express.Router();
const db = require("../db"); // Using the async MySQL connection

//  Get all drivers
router.get("/drivers", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM drivers");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//  Get all vehicles with driver names (Fixed JOIN issue)
router.get("/vehicles", async (req, res) => {
    try {
        const sql = `
            SELECT v.id, v.vehicle_no, 
                   COALESCE(v.driver_id, 0) AS driver_id, 
                   COALESCE(d.name, 'No Driver') AS driver_name 
            FROM vehicles v
            LEFT JOIN drivers d ON v.driver_id = d.id
        `;
        const [result] = await db.query(sql);

        console.log(" Vehicles fetched:", result);
        res.json(result);
    } catch (err) {
        console.error(" Error fetching vehicles:", err);
        res.status(500).json({ error: err.message });
    }
});


// Add Driver Route
router.post('/add-driver', async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required" });
        }

        const [result] = await db.execute("INSERT INTO drivers (name, phone) VALUES (?, ?)", [name, phone]);
        
        res.status(201).json({ message: "Driver added successfully", driverId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Add Vehicle Route
router.post('/add-vehicle', async (req, res) => {
    try {
        const { vehicle_no, driver_id } = req.body;
        if (!vehicle_no || !driver_id) {
            return res.status(400).json({ message: "Vehicle number and driver ID are required" });
        }

        const [result] = await db.execute("INSERT INTO vehicles (vehicle_no, driver_id) VALUES (?, ?)", [vehicle_no, driver_id]);
        
        res.status(201).json({ message: "Vehicle added successfully", vehicleId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});




//  Get all bookings with user and vehicle info
router.get("/bookings", async (req, res) => {
    try {
        const sql = `
            SELECT bookings.id, users.name AS user_name, vehicles.vehicle_no, bookings.time_slot_id
            FROM bookings 
            JOIN users ON bookings.user_id = users.id 
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
        `;
        const [results] = await db.query(sql);
        res.json({ bookings: results.length ? results : [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Update booking time slot
router.put("/update-time", async (req, res) => {
    const { booking_id, new_time_slot } = req.body;
    if (!booking_id || !new_time_slot) {
        return res.status(400).json({ error: "Booking ID and new time slot are required" });
    }

    try {
        const [result] = await db.query("UPDATE bookings SET time_slot = ? WHERE id = ?", [new_time_slot, booking_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ message: "Time slot updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Fetch all time slots
router.get("/time-slots", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM time_slots");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Add a new time slot
router.post("/time-slots", async (req, res) => {
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: "Time slot required" });

    try {
        await db.query("INSERT INTO time_slots (time) VALUES (?)", [time]);
        res.json({ message: "Time slot added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Delete a time slot
router.delete("/time-slots/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM time_slots WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Time slot not found" });
        }
        res.json({ message: "Time slot deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;