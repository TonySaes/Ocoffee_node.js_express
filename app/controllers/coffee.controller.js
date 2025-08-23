import coffeeModels from "../models/coffee.models.js";

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

        try {
            const coffees = await coffeeModels.getCoffees();
            if (!coffees) {
                return res.status(404).render("404", { message: "Aucun café trouvé", title: "Erreur 404" });
            }
            
            res.render("coffees", { coffees, title: "Liste des cafés", cssFile: "catalog.css", okMessage, errorMessage });
        } catch (error) {
            next(error);
        }
    },
}