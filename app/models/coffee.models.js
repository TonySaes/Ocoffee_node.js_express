import client from "./db.js";

export default {
    async getCoffeesNameForHome() {
        try {
            const res = await client.query('SELECT name, reference FROM coffee LIMIT 3');
            return res.rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des noms de cafés :', error.message);
            throw error;
        }
    }
}