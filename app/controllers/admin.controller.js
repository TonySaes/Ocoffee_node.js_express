import tasteModel from "../models/taste.models.js";
import countryModel from "../models/country.models.js";
import coffeeModels from "../models/coffee.models.js";

export default {
    async index(req, res, next) {
        try {
            const { errorMessage } = req.query;
            const coffeeTypes = await tasteModel.getAllTypes();
            if (!coffeeTypes) {
                return res.status(404).render("404", { message: "Aucun type de café trouvé", title: "Erreur 404" });
            }
            res.render("createCoffee", { title: "Créer un article", cssFile: "createCoffee.css", errorMessage, coffeeTypes });
        } catch (error) {
            next(error)
        }
    },
    async createCoffee(req, res, next) {
        const { name, description, price, reference, country, coffee_type } = req.body;
        const file = req.file;
        if (!name || !description || !price || !reference || !country || !coffee_type) {
            const errorMessage = encodeURIComponent("Tous les champs sont requis.");
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
        // Récupération du country_id
        let countryId = await countryModel.getCountryIdByName(country);
        if (!countryId) {
            await countryModel.createCountry(country);
            countryId = await countryModel.getCountryIdByName(country);
        }
        //Récupération des taste_ids
        const typesInput = Array.isArray(coffee_type) ? coffee_type.map(Number) : (coffee_type ? [Number(coffee_type)] : []);
        const type_ids = await tasteModel.getTasteById(typesInput);
        //Création de l'objet coffeeData pour création
        const coffeeData = {
            name: String(name),
            description: String(description),
            price: Number(price),
            reference: String(reference || "").trim(),
            country: Number(countryId),
            coffee_type: type_ids
        };
        // Validation simple
        const errors = [];
        if (!name?.trim()) errors.push("Le nom est requis.");
        if (!price || isNaN(Number(price))) errors.push("Le prix doit être un nombre.");
        if (!countryId) errors.push("Le pays est requis.");
        if (!reference?.trim()) errors.push("La référence est requise.");
        if (errors.length) {
            if (file) {
                try { await fs.unlink(file.path); } catch {}
            }
            const errorMessage = encodeURIComponent(errors.join(" "));
            return res.redirect(`/createCoffee?errorMessage=${errorMessage}`);
        }
        // Création du café
        try {
            await coffeeModels.createCoffeeAndBelong(coffeeData, type_ids.map(type => type.taste_id));
            const okMessage = encodeURIComponent(`Café ${name} créé avec succès !`);
            res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création du café.");
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
    }
};
