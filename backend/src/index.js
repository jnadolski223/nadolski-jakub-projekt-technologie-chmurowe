const express = require("express");
const validator = require("validator");
const { v4 } = require("uuid");

const PORT = 3000;
const server = express();
server.use(express.json());
server.listen(PORT, () => console.log(`Backend server running at port ${PORT}`));

// ==================== ACCOUNT MANAGEMENT ====================
const accounts = [];

server.post("/account", (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

    if (!username || !firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    };

    const isUserPresent = accounts.find(user => user.username === username);
    if (isUserPresent) {
        return res.status(409).json({ error: `User ${username} already exists` });
    };

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    };

    const newAccount = { username, firstName, lastName, email, password };
    accounts.push(newAccount);

    res.status(201).json({ message: "New account created" });
});

server.get("/accounts", (req, res) => {
    res.status(200).json(accounts);
});

server.get("/account", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    };

    const requestedUser = accounts.find(user => user.username === username);
    if (!requestedUser) {
        return res.status(404).json({ error: `User ${username} not found` });
    };

    res.status(200).json(requestedUser);
});

server.patch("/account", (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    };

    const requestedUser = accounts.find(user => user.username === username);
    if (!requestedUser) {
        return res.status(404).json({ error: `User ${username} not found` });
    };

    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    };

    if (firstName) requestedUser.firstName = firstName;
    if (lastName) requestedUser.lastName = lastName;
    if (email) requestedUser.email = email;
    if (password) requestedUser.password = password;

    res.status(200).json({ message: `User ${username} updated successfully` });
});

server.delete("/account", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    };

    const userIndex = accounts.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: `User ${username} not found`});
    };

    accounts.splice(userIndex, 1);
    res.status(200).json({ message: `User ${username} deleted successfully` })
});
// ============================================================

// ===================== EVENT MANAGEMENT =====================
const events = [];

server.post("/event", (req, res) => {
    const { username, eventName, date, time, description } = req.body;

    if (!username || !eventName || !date || !time || !description) {
        return res.status(400).json({ error: "All field are required" });
    };

    const isUserPresent = accounts.find(user => user.username == username);
    if (!isUserPresent) {
        return res.status(404).json({ error: `User ${username} not found` });
    };

    if (!validator.isDate(date)) {
        return res.status(400).json({ error: "Invalid date format" });
    };

    if (!validator.isTime(time)) {
        return res.status(400).json({ error: "Invalid time format" });
    };

    const newEvent = { eventId: v4(), username, eventName, date, time, description };
    events.push(newEvent);
    res.status(201).json({ message: "New event created successfully" });
});

server.get("/events", (req, res) => {
    res.status(200).json(events);
});

server.get("/event", (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).json({ error: "EventId is required" });
    };

    const requestedEvent = events.find(event => event.eventId === eventId);
    if (!requestedEvent) {
        return res.status(404).json({ error: `Event ${eventId} not found` });
    };

    res.status(200).json(requestedEvent);
});

server.patch("/event", (req, res) => {
    const { eventId, eventName, date, time, description } = req.body;

    if (!eventId) {
        return res.status(400).json({ error: "EventId is required" });
    };

    const requestedEvent = events.find(event => event.eventId === eventId);
    if (!requestedEvent) {
        return res.status(404).json({ error: `Event ${eventId} not found` });
    };

    if (date && !validator.isDate(date)) {
        return res.status(400).json({ error: "Invalid date format" });
    };

    if (time && !validator.isTime(time)) {
        return res.status(400).json({ error: "Invalid time format" });
    };

    if (eventName) requestedEvent.eventName = eventName;
    if (date) requestedEvent.date = date;
    if (time) requestedEvent.time = time;
    if(description) requestedEvent.description = description;

    res.status(200).json({ message: `Event ${eventId} updated successfully` });
});

server.delete("/event", (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).json({ error: "EventIs is required" });
    };

    const eventIndex = events.findIndex(event => event.eventId === eventId);
    if (eventIndex === -1) {
        return res.status(404).json({ error: `Event ${eventId} not found` });
    };

    events.splice(eventIndex, 1);
    res.status(200).json({ message: `Event ${eventId} deleted successfully` });
});

// ============================================================