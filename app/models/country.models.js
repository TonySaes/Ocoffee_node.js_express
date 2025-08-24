import client from "./db.js";

export default {
    async createCountry(name) {
        try {
            const res = await client.query("INSERT INTO country (name) VALUES ($1) RETURNING country_id", [name]);
            return res.rows[0].country_id;
        } catch (error) {
            console.error("Erreur dans la création du pays :", error);
            throw error;
        }
    },

    async deleteCountry(id) {
        try {
            await client.query("DELETE FROM country WHERE country_id = $1", [id]);
        } catch (error) {
            console.error("Erreur dans la suppression du pays :", error);
            throw error;
        }
    },

    async getAllCountries() {
        try {
            const res = await client.query("SELECT * FROM country");
            return res.rows;
        } catch (error) {
            console.error("Erreur dans la récupération des pays :", error);
            throw error;
        }
    },

    async getCountryIdByName(name) {
        try {
            const res = await client.query("SELECT country_id FROM country WHERE name ILIKE $1 LIMIT 1", [name]);
            return res.rows.length ? res.rows[0].country_id : null;
        } catch (error) {
            console.error("Erreur dans la récupération de l'ID du pays par nom :", error);
            throw error;
        }
    },
}
