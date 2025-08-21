import client from "./db.js";

export default {
    async getCoffees() {
        try {
            const res = await client.query("SELECT coffee.coffee_id, coffee.reference, coffee.name, coffee.price, country.name as country_name FROM coffee JOIN country ON country.country_id = coffee.country_id ORDER BY coffee.name");
            return res.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des cafés :", error.message);
            throw error;
        }
    },

    async getCoffeeById(id) {
        try {
            const res = await client.query("SELECT coffee.coffee_id, coffee.reference, coffee.name, coffee.price, country.name AS country_name, coffee.description, STRING_AGG(taste.type, ', ' ORDER BY taste.type) AS coffee_type FROM coffee JOIN country ON country.country_id = coffee.country_id join belong ON belong.coffee_id = coffee.coffee_id join taste ON taste.taste_id = belong.taste_id WHERE coffee.coffee_id = $1 group by coffee.coffee_id, coffee.name, coffee.reference, country.name, coffee.description, coffee.price", [id]);
            return res.rows[0];
        } catch (error) {
            console.error("Erreur lors de la récupération du café :", error.message);
            throw error;
        }
    },

    async getCoffeesNameForHome() {
        try {
            const res = await client.query("SELECT name, reference, coffee_id FROM coffee LIMIT 3");
            return res.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des noms de cafés :", error.message);
            throw error;
        }
    },

    async createCoffeeAndBelong(coffeeData, tasteIds) {
        try {
            const res = await client.query(
                `INSERT INTO coffee (name, description, price, reference, country_id) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING coffee_id`,
                [coffeeData.name, coffeeData.description, coffeeData.price, coffeeData.reference, coffeeData.country_id]
            );
            const coffeeId = res.rows[0].coffee_id;

            if (tasteIds && tasteIds.length > 0) {
                for (const tasteId of tasteIds) {
                    await client.query(`INSERT INTO belong (coffee_id, taste_id) VALUES ($1, $2)`, [coffeeId, tasteId]);
                }
            }
            return coffeeId;
        } catch (error) {
            console.error("Erreur lors de la création du café :", error.message);
            throw error;
        }
    }
}