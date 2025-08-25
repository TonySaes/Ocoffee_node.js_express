import coffeeModels from "../models/coffee.models.js";
import countryModels from "../models/country.models.js";
import tasteModels from "../models/taste.models.js";

import searchFilters from "../modules/searchFilters.js";

export default {
    detail: async (req, res, next) => {
        try {
            const coffee = await coffeeModels.getCoffeeById(req.params.id);
            if (!coffee) {
                return res.status(404).render("404", { message: "Café non trouvé", title: "Erreur 404" });
            }

            res.render("coffee", { coffee, title: coffee.name, cssFile: "coffee.css" });
        } catch (error) {
            next(error);
        }
    },
     
    list: async (req, res, next) => {
        const { okMessage } = req.query;
        const { errorMessage } = req.query;
        let { country, name, type } = req.query;

        try {
            const countries = await countryModels.getAllCountries();
            const coffeeTypes = await tasteModels.getAllTypes();
            let coffees = await coffeeModels.getCoffees();
            if (!coffees || !countries) {
                return res.status(500).render("404", { message: "Erreur dans la récupération des données", title: "Erreur 500" });
            }
            coffees = searchFilters(coffees, { country, name, type });
            res.render("coffees", { coffees, title: "Liste des cafés", cssFile: "catalog.css", okMessage, errorMessage, countries, coffeeTypes });
        } catch (error) {
            next(error);
        }
    },
}