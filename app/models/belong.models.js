import client from "./db.js";

export default {
    async createBelong(coffeeId, tasteId) {
        try {
            const res = await client.query("INSERT INTO belong (coffee_id, taste_id) VALUES ($1, $2) RETURNING *", [coffeeId, tasteId]);
            return res.rows[0];
        } catch (error) {
            console.error("Erreur lors de la création de l'association belong :", error.message);
            throw error;
        }
    }
}