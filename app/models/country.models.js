import client from "./db.js";

export default {
    async createCountry(name) {
        try {
            const res = await client.query(`INSERT INTO country (name) VALUES ($1) RETURNING country_id`, [name]);
            return res.rows[0].country_id;
        } catch (error) {
            console.error("Error creating country:", error);
            throw error;
        }
    },

    async getCountryIdByName(name) {
        try {
            const res = await client.query(`SELECT country_id FROM country WHERE name ILIKE $1 LIMIT 1`, [name]);
            return res.rows.length ? res.rows[0].country_id : null;
        } catch (error) {
            console.error("Error getting country ID by name:", error);
            throw error;
        }
    },
}
