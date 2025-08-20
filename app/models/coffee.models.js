import client from "./db.js";

export default {
    async getCoffees() {
        try {
            const res = await client.query('SELECT coffee.reference, coffee.name, coffee.price, country.name as country_name FROM coffee JOIN country ON country.country_id = coffee.country_id ORDER BY coffee.name');
            return res.rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des cafés :', error.message);
            throw error;
        }
    },
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