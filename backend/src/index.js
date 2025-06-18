const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const Redis = require("ioredis");
const { Pool } = require("pg");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("validator");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// PostgreSQL config
const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
});

// MongoDB config
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("MongoDB connection error:", err));

const eventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String }
});
const Event = mongoose.model("Event", eventSchema);

const assignmentSchema = new mongoose.Schema({
    assignId: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    userId: { type: String, required: true }
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

const redisClient = new Redis({ host: "localhost", port: 6379 });

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.listen(process.env.PORT, () => console.log(`App backend listening on port ${process.env.PORT}`));

const requireLogin = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
    next();
};

// Creating a new user account
app.post("/accounts", async (req, res) => {
    const { username, email, password } = req.body;

    // Validation of parameters
    if (!username || !email || !password) return res.status(400).json({ message: "Missing required fields" });
    if (username.length > 50 || username.length < 8) return res.status(400).json({ message: "Username must be 8-50 characters" });
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email address"});
    if (email.length > 255) return res.status(400).json({ message: "Email exceeds 255 characters" });
    if (password.length < 8 || password.length > 255) return res.status(400).json({ message: "Password must be 8-255 characters" });

    // Inserting user's data into database
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await pool.query(
            "INSERT INTO accounts (userId, username, email, password) VALUES ($1, $2, $3, $4)",
            [userId, username, email, hashedPassword]
        );
        res.status(201).json({ message: "Created new account" });
    } catch (err) {
        if (err.code === "23505") {
            const field = err.detail.includes("username") ? "username" : "email";
            return res.status(400).json({ message: `${field} already exists` });
        };

        res.status(500).json({ error: err.message });
    };
});

// Getting user's data
app.get("/accounts/me", requireLogin, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Checking if user exists
        const result = await pool.query("SELECT * FROM accounts WHERE userId = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        // Removing password from result
        const user = result.rows[0];
        const { password, ...safeData } = user;
        res.status(200).json(safeData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Updating user's data
app.patch("/accounts/me", requireLogin, async (req, res) => {
    const userId = req.session.userId;
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;

    try {
        // Checking if user exists
        const userQuery = await pool.query("SELECT * FROM accounts WHERE userId = $1", [userId]);
        if (userQuery.rows.length === 0) return res.status(404).json({ message: "User not found" });

        // Authorization - checking if current password is correct
        const user = userQuery.rows[0];
        if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Validating fields
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (newUsername) {
            if (newUsername.length < 8 || newUsername.length > 50) return res.status(400).json({ message: "Username must be 8-50 characters" });
            updates.push(`username = $${paramIndex++}`);
            values.push(newUsername);
        };

        if (newEmail) {
            if (!validator.isEmail(newEmail)) return res.status(400).json({ message: "Invalid email address"});
            if (newEmail.length > 255) return res.status(400).json({ message: "Email exceeds 255 characters" });
            updates.push(`email = $${paramIndex++}`);
            values.push(newEmail);
        };

        if (newPassword) {
            if (newPassword.length < 8 || newPassword.length > 255) return res.status(400).json({ message: "Password must be 8-255 characters" });
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.push(`password = $${paramIndex++}`);
            values.push(hashedPassword);
        };

        if (updates.length === 0) return res.status(400).json({ message: "No valid fields to update" });

        // Updating user with new data
        values.push(userId);
        const query = `UPDATE accounts SET ${updates.join(", ")} WHERE userId = $${paramIndex}`;
        await pool.query(query, values);
        res.status(200).json({ message: "Account updated successfully" });
    } catch (err) {
        if (err.code === "23505") {
            const field = err.detail.includes("username") ? "username" : "email";
            return res.status(409).json({ message: `${field} already exists`});
        };

        res.status(500).json({ error: err.message });
    };
});

// Deleting user's account
app.delete("/accounts/me", requireLogin, async (req, res) => {
    const userId = req.session.userId;
    const { password } = req.body;

    try {
        // Checking if user exists
        const userQuery = await pool.query("SELECT * FROM accounts WHERE userId = $1", [userId]);
        if (userQuery.rows.length === 0) return res.status(404).json({ message: "User not found" });

        // Authorization - checking if current password is correct
        const user = userQuery.rows[0];
        if (!password) return res.status(400).json({ message: "Current password is required" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Deleting user's account
        await pool.query("DELETE FROM accounts WHERE userId = $1", [userId]);
        res.status(200).json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Creating a new event
app.post("/events", requireLogin, async (req, res) => {
    const { title, location, date, time, description } = req.body;

    // Validation of parameters
    if (!title || !location || !date || !time || !description) return res.status(400).json({ message: "Missing required fields" });
    if (!validator.isDate(date, { format: "YYYY-MM-DD", strictMode: true })) return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    if (!validator.matches(time, timeFormatRegex)) return res.status(400).json({ message: "Invalid time format. Use HH:mm (24h)" });

    try {
        // Checking if user exists
        const result = await pool.query("SELECT * FROM accounts WHERE userId = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        // Inserting event's data into database
        const eventId = uuidv4();
        const newEvent = new Event({ eventId, userId: req.session.userId, title, location, date, time, description });
        await newEvent.save();
        res.status(201).json({ message: "Created new event" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Getting event's data
app.get("/events/:eventId", async (req, res) => {
    const eventId = req.params.eventId;

    try {
        // Checking if event exists
        const event = await Event.findOne({ eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Getting events' filtered data
app.get("/events", async (req, res) => {
    const { title, location, date, time } = req.query;
    const filter = {};

    // Adding filters
    if (title) filter.title = { $regex: title, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (date) filter.date = date;
    if (time) filter.time = { $gte: time };

    // Getting all matching events
    try {
        const events = await Event.find(filter).sort({ date: 1, time: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Updating event's data
app.patch("/events/:eventId", requireLogin, async (req, res) => {
    const eventId = req.params.eventId;
    const { title, location, date, time, description } = req.body;

    // Adding and validating new fields
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (location) updatedFields.location = location;
    if (date) {
        if (!validator.isDate(date, { format: "YYYY-MM-DD", strictMode: true })) return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
        updatedFields.date = date;
    };
    if (time) {
        if (!validator.matches(time, timeFormatRegex)) return res.status(400).json({ message: "Invalid time format. Use HH:mm (24h)" });
        updatedFields.time = time;
    };
    if (description) updatedFields.description = description;

    try {
        // Checking if event exists and updating
        const updatedEvent = await Event.findOneAndUpdate({ eventId }, { $set: updatedFields }, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Deleting event and its assignments
app.delete("/events/:eventId", requireLogin, async (req, res) => {
    const eventId = req.params.eventId;

    try {
        // Deleting event's assignments
        await Assignment.deleteMany({ eventId });

        // Checking if event exists
        const deletedEvent = await Event.findOneAndDelete({ eventId });
        if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event and its assignments deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Getting events owned by user
app.get("/events/owned/me", requireLogin, async (req, res) => {
    const userId = req.session.userId;

    try {
        const events = await Event.find({ userId }).sort({ date: 1, time: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Getting events assigned to user
app.get("/events/signed/me", requireLogin, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Returning empty array if user has no assignments
        const assignments = await Assignment.find({ userId });
        if (assignments.length === 0) return res.status(200).json([]);
        
        const eventIds = assignments.map(a => a.eventId);
        const events = await Event.find({ eventId: { $in: eventIds } }).sort({ date: 1, time: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Assigning user to event
app.post("/assignments/:eventId/me", requireLogin, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.session.userId;

    try {
        // Checking if event exists
        const event = await Event.findOne({ eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Checking if user is the owner
        if (event.userId === userId) return res.status(400).json({ message: "User cannot assign to their own event" });

        // Checking if user is already assigned to the event
        const alreadyAssigned = await Assignment.findOne({ eventId, userId });
        if (alreadyAssigned) return res.status(409).json({ message: "User is already assigned to this event" });

        const assignId = uuidv4();
        const assignment = new Assignment({ assignId, eventId, userId });
        await assignment.save();
        res.status(201).json({ message: "User is assigned to event" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Unassigning user from event
app.delete("/assignments/:eventId/me", requireLogin, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.session.userId;

    try {
        // Checking if assignment exists
        const deletedAssignment = await Assignment.findOneAndDelete({ eventId, userId });
        if (!deletedAssignment) return res.status(404).json({ message: "Assignment not found" });
        
        res.status(200).json({ message: "user is unassigned from event" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Logging in and creating a session
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM accounts WHERE username = $1 AND password = $2",
            [username, password]
        );

        const user = result.rows[0];
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        req.session.userId = user.userId;
        res.status(200).json({ message: "User logged in" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
});

// Logging out and destroying session
app.post("/logout", requireLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: err.message });
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "User logged out" });
    });
});