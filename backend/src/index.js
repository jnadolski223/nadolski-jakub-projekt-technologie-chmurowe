import express from "express";
import { pool } from "./db/postgres.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.listen(process.env.PORT, () => console.log(`App backend listening on port ${process.env.PORT}`));

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
app.get("/accounts/:userId", async (req, res) => {
    const userId = req.params.userId;

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
app.patch("/accounts/:userId", async (req, res) => {
    const userId = req.params.userId;
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
app.delete("/accounts/:userId", async (req, res) => {
    const userId = req.params.userId;
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
