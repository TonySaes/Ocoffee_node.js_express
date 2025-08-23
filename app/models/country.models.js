import client from "./db.js";

export default {
    async createCountry(name) {
        const sql = `INSERT INTO country (name) VALUES ($1) RETURNING country_id`;
        const val = [String(name || "").trim()];
        const { rows } = await client.query(sql, val);
        return rows[0].country_id; 
    },

    async getCountryIdByName(name) {
        const sql = `SELECT country_id FROM country WHERE name ILIKE $1 LIMIT 1`;
        const val = [String(name || "").trim()];
        const { rows } = await client.query(sql, val);
        return rows.length ? rows[0].country_id : null; 
    },
}
