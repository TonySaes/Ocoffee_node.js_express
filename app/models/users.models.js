import client from "./db.js";

export default {
    async getAllUsers() {
        try {
        const res = await client.query(
            `SELECT id, username, is_admin
            FROM users ORDER BY username`
        );
        return res.rows;
        } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
        }
    },
    async findByUsername(username) {
        try {
        const res = await client.query("SELECT id, username, password, is_admin FROM users WHERE username = $1 LIMIT 1", 
            [String(username).trim()]);
        return res.rows[0] || null;
        } catch (error) {
        console.error("Error finding user by username:", error);
        throw error;
        }
    },

    async createUser({ username, password_hash, is_admin = true }) {
        try {
        const res = await client.query("INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING id",
            [String(username).trim(), password_hash, !!is_admin]);
        return res.rows[0].id;
        } catch (error) {
        console.error("Error creating user:", error);
        throw error;
        }
    },
};
