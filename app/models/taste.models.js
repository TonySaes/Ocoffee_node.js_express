import client from "./db.js";

export default {
    async getAllTypes() {
        try {
            const res = await client.query("SELECT type FROM taste");
            return res.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des types de café :", error);
            throw error;
        }
    }
}