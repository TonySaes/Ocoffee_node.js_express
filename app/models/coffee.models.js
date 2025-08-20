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

    async getCoffeeByReference(reference) {
        try {
            const res = await client.query("SELECT coffee.reference, coffee.name, coffee.price, country.name AS country_name, coffee.description, STRING_AGG(taste.type, ', ' ORDER BY taste.type) AS coffee_type FROM coffee JOIN country ON country.country_id = coffee.country_id join belong ON belong.reference = coffee.reference join taste ON taste.taste_id = belong.taste_id WHERE coffee.reference = $1 group by coffee.name, coffee.reference, country.name, coffee.description, coffee.price", [reference]);
            return res.rows[0];
        } catch (error) {
            console.error('Erreur lors de la récupération du café :', error.message);
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