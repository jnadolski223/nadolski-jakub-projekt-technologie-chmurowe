const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const moment = require("moment");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const PORT = 3000;
const server = express();
server.use(express.json());
server.listen(PORT, () => console.log(`Backend server running at port ${PORT}`));

// ==================== USERS MANAGEMENT ====================
const users = [];

server.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    };

    const isUserPresent = users.find(user => user.username === username);
    if (isUserPresent) {
        return res.status(409).json({ error: "Requested username is already taken" });
    };

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    };

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAccount = { userId: uuidv4(), username, email, password: hashedPassword };
    users.push(newAccount);

    res.status(201).json({ message: "New user created" });
});

server.get("/users", (req, res) => {
    res.status(200).json(users);
});

server.get("/users/:id", (req, res) => {
    const userId = req.params.id;

    const requestedUser = users.find(user => user.userId === userId);
    if (!requestedUser) {
        return res.status(404).json({ error: "User not found" });
    };

    res.status(200).json(requestedUser);
});

server.patch("/users/:id", (req, res) => {
    const userId = req.params.id;
    
    const requestedUser = users.find(user => user.userId === userId);
    if (!requestedUser) {
        return res.status(404).json({ error: "User not found" });
    };

    const { username, email, password } = req.body;

    if (username) {
        if (requestedUser.username === username) {
            return res.status(400).json({ error: "Requested username is the same as the current" });
        };

        const isUserTaken = users.find(user => user.username === username);
        if (isUserTaken) {
            return res.status(409).json({ error: "Requested username is already taken" });
        };
    }

    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    };

    if (username) requestedUser.username = username;
    if (email) requestedUser.email = email;
    if (password) requestedUser.password = password;

    res.status(200).json({ message: "User updated" });
});

server.delete("/users/:id", (req, res) => {
    const userId = req.params.id;

    const userIndex = users.findIndex(user => user.userId === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found"});
    };

    users.splice(userIndex, 1);
    res.status(200).json({ message: "User deleted" });
});
// ============================================================

// ===================== LOGIN MANAGEMENT =====================
server.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const requestedUser = users.find(user => user.username === username);
    if (!requestedUser) {
        return res.status(404).json({ error: "User not found" });
    };

    const isPasswordValid = await bcrypt.compare(password, requestedUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
    };

    res.status(200).json({ message: "User logged in" });
});

// TODO: logout endpoint

// ============================================================

// ===================== EVENT MANAGEMENT =====================
const events = [];

server.post("/events", (req, res) => {
    const { userId, eventName, date, time, description } = req.body;

    if (!userId || !eventName || !date || !time || !description) {
        return res.status(400).json({ error: "All fields are required" });
    };

    const isUserPresent = users.find(user => user.userId === userId);
    if (!isUserPresent) {
        return res.status(404).json({ error: "User not found" });
    };

    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
    };

    if (!moment(time, "HH:mm", true).isValid()) {
        return res.status(400).json({ error: "Invalid time format" });
    };

    const newEvent = { eventId: uuidv4(), userId, eventName, date, time, description };
    events.push(newEvent);
    res.status(201).json({ message: "New event created" });
});

server.get("/events", (req, res) => {
    res.status(200).json(events);
});

server.get("/events/:id", (req, res) => {
    const eventId = req.params.id;

    const requestedEvent = events.find(event => event.eventId === eventId);
    if (!requestedEvent) {
        return res.status(404).json({ error: "Event not found" });
    };

    res.status(200).json(requestedEvent);
});

server.patch("/events/:id", (req, res) => {
    const eventId = req.params.id;
    
    const requestedEvent = events.find(event => event.eventId === eventId);
    if (!requestedEvent) {
        return res.status(404).json({ error: "Event not found" });
    };

    const { eventName, date, time, description } = req.body;

    if (date && !moment(date, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
    };

    if (time && !moment(time, "HH:mm", true).isValid()) {
        return res.status(400).json({ error: "Invalid time format" });
    };

    if (eventName) requestedEvent.eventName = eventName;
    if (date) requestedEvent.date = date;
    if (time) requestedEvent.time = time;
    if(description) requestedEvent.description = description;

    res.status(200).json({ message: "Event updated" });
});

server.delete("/events/:id", (req, res) => {
    const eventId = req.params.id;

    const eventIndex = events.findIndex(event => event.eventId === eventId);
    if (eventIndex === -1) {
        return res.status(404).json({ error: "Event not found" });
    };

    events.splice(eventIndex, 1);
    res.status(200).json({ message: "Event deleted" });
});

server.get("/users/:id/events", (req, res) => {
    const userId = req.params.id;

    const requestedUser = users.find(user => user.userId === userId);
    if (!requestedUser) {
        return res.status(404).json({ error: "User not found" });
    };

    const userEvents = events.filter(event => event.userId === userId);

    res.status(200).json(userEvents);
});

// ============================================================