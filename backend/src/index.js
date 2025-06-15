const express = require("express");
const validator = require("validator");

const PORT = 3000;
const server = express();
server.use(express.json());
server.listen(PORT, () => console.log(`Backend server running at port ${PORT}`));

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

    if (firstName) requestedUser.firstName = firstName;
    if (lastName) requestedUser.lastName = lastName;
    if (email) {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        };
        requestedUser.email = email;
    };
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