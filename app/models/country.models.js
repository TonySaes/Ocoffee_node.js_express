import client from "./db.js";

export default {
    async getCountryIdByName(name) {
        try {
            const res = await client.query(`SELECT country_id FROM country WHERE name = $1`, [name]);
            return res.rows[0]?.country_id || null;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID du pays :", error);
            throw error;
        }
    },
    async createCountry(name) { 
        try {
            const res = await client.query(`INSERT INTO country (name) VALUES ($1) RETURNING country_id`, [name]);
            return res.rows[0].country_id;
        } catch (error) {
            console.error("Erreur lors de la création du pays :", error);
            throw error;
        }
    }
}
