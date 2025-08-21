import tasteModel from "../models/taste.models.js";

export default {
    async index(req, res) {
        const { errorMessage } = req.query;
        const coffeeTypes = await tasteModel.getAllTypes();
        res.render("createCoffee", { title: "Créer un article", cssFile: "createCoffee.css", errorMessage, coffeeTypes });
    },
    async create(req, res) {
        const { name, description, price, reference, country, coffee_type } = req.body;
        if (!name || !description || !price || !reference || !country || !coffee_type) {
            const errorMessage = encodeURIComponent("Tous les champs sont requis.");
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
        try {
            
            const okMessage = encodeURIComponent(`Café ${name} créé avec succès !`);
            res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création du café.");
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
    }
};
