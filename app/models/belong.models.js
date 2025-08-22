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
    },

    async getTasteIdsByCoffeeId(coffeeId) {
        try {
            const res = await client.query("SELECT taste_id FROM belong WHERE coffee_id = $1", [coffeeId]);
            return res.rows.map(row => row.taste_id);
        } catch (error) {
            console.error("Erreur lors de la récupération des types de café :", error.message);
            throw error;
        }
    },

    async deleteBelong(coffeeId, tasteId) {
        try {
            const res = await client.query("DELETE FROM belong WHERE coffee_id = $1 AND taste_id = $2 RETURNING *", [coffeeId, tasteId]);
            return res.rows[0];
        } catch (error) {
            console.error("Erreur lors de la suppression de l'association belong :", error.message);
            throw error;
        }
    }
}