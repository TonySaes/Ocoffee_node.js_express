import fs from "node:fs/promises";
import tasteModel from "../models/taste.models.js";
import countryModel from "../models/country.models.js";
import coffeeModels from "../models/coffee.models.js";
import belongModels from "../models/belong.models.js";

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
        const file = req.file;

        try {
            const { name, description, price, reference, country, coffee_type } = req.body;

            // 1) Création des variables adaptées aux contraintes de la BDD
            const parsedPrice = Number(String(price).trim().replace(",", "."));
            let tasteIds = [];
            if (Array.isArray(coffee_type)) {
                tasteIds = coffee_type.map(Number);
            } else if (coffee_type != null) { // couvre undefined et null
                tasteIds = [Number(coffee_type)];
            };
            // 2) Validations basiques
            const errors = [];
            if (!String(name || "").trim()) errors.push("Le nom est requis.");
            if (!String(description || "").trim()) errors.push("La description est requise.");
            if (!Number.isFinite(parsedPrice)) errors.push("Le prix doit être un nombre.");
            if (!String(reference || "").trim()) errors.push("La référence est requise.");
            if (!String(country || "").trim()) errors.push("Le pays est requis.");
            if (!tasteIds.length) errors.push("Sélectionnez au moins une caractéristique.");

            if (errors.length) {
                if (file?.path) { try { await fs.unlink(file.path); } catch {} }
                const errorMessage = encodeURIComponent(errors.join(" "));
                return res.redirect(`/admin?errorMessage=${errorMessage}`);
            };

            // 3) country_id depuis le nom (création auto si absent)
            let countryId = await countryModel.getCountryIdByName(country);
            if (!countryId) {
                countryId = await countryModel.createCountry(country);
            }

            // 4) Données café
            const coffeeData = {
                name: String(name),
                description: String(description),
                price: parsedPrice,
                reference: String(reference).trim(),
                country_id: Number(countryId),
            };

            // 5) Insertion café
            const coffeeId = await coffeeModels.createCoffee(coffeeData);

            // 6) Liaisons belong (une requête paramétrée par ID, simple & lisible)
            for (const tid of tasteIds) {
                await belongModels.createBelong(coffeeId, tid);
            }
            const okMessage = encodeURIComponent(`Café "${coffeeData.name}" créé avec succès !`);
            return res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            // Log détaillé utile pour PG
            console.error("[createCoffee] ERROR:", {
                message: error.message,
                code: error.code,
                detail: error.detail,
                constraint: error.constraint
            });
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création du café.");
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
    }
}