import client from "./db.js";

export default {
    async createTaste(type) {
        try {
            const res = await client.query(`INSERT INTO taste (type) VALUES ($1) ON CONFLICT (type) DO UPDATE SET type = EXCLUDED.type RETURNING taste_id`, [type]);
            return res.rows[0].taste_id;
        } catch (error) {
            console.error("Erreur lors de la création du type de café :", error);
            throw error;
        }
    },

    async getAllTypes() {
        try {
            const res = await client.query("SELECT type, taste_id FROM taste ORDER BY type");
            return res.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des types de café :", error);
            throw error;
        }
    },

    async getTasteById(IDs) {
        try {
            const results = [];
            for (const id of IDs) {
                const res = await client.query(`SELECT type, taste_id FROM taste WHERE taste_id = $1`, [id]);
                if (res.rows.length > 0) {
                    results.push(res.rows[0]);
                }
            }
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des types de café par ID :", error);
            throw error;
        }
    },

    async getTasteByName(name) {
        try {
            const res = await client.query(`SELECT type, taste_id FROM taste WHERE type ILIKE $1`, [name]);
            return res.rows[0];
        } catch (error) {
            console.error("Erreur lors de la récupération du type de café par nom :", error);
            throw error;
        }
    }
};