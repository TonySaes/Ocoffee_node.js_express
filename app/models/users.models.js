import client from "./db.js";

export default {
    async createUser({ username, password, is_admin }) {
        try {
        const res = await client.query("INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id",
            [String(username).trim(), password, is_admin]);
        return res.rows[0].id;
        } catch (error) {
        console.error("Erreur dans la création de l'utilisateur :", error);
        throw error;
        }
    },

    async deleteUser(id) {
        try {
            await client.query("DELETE FROM users WHERE id = $1", [id]);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            throw error;
        }
    },

    async findUserById(id) {
        try {
        const res = await client.query("SELECT id, username, password, is_admin FROM users WHERE id = $1 LIMIT 1", 
            [id]);
        return res.rows[0] || null;
        } catch (error) {
        console.error("Erreur dans la recherche de l'utilisateur par id :", error);
        throw error;
        }
    },

    async findUserByName(username) {
        try {
            const res = await client.query("SELECT id, username, password, is_admin FROM users WHERE username ILIKE $1 LIMIT 1",
                [String(username).trim()]);
            return res.rows[0] || null;
        } catch (error) {
            console.error("Erreur dans la recherche de l'utilisateur par nom :", error);
            throw error;
        }
    },

    async getAllUsers() {
        try {
        const res = await client.query("SELECT id, username, is_admin FROM users ORDER BY username");
        return res.rows;
        } catch (error) {
        console.error("Erreur dans la récupération des utilisateurs :", error);
        throw error;
        }
    },
    
    async updateUser(id, { username, password, is_admin }) {
        try {
            await client.query("UPDATE users SET username = $1, password = $2, is_admin = $3 WHERE id = $4",
                [String(username).trim(), password, is_admin, id]);
        } catch (error) {
            console.error("Erreur dans la mise à jour de l'utilisateur :", error);
            throw error;
        }
    },

};
