import client from "./db.js";

export default {
    async getAllTypes() {
        try {
            const res = await client.query("SELECT type, taste_id FROM taste");
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
   
};