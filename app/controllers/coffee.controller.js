import coffeeModels from "../models/coffee.models.js";

export default {
    list: async (req, res, next) => {
        try {
            const coffees = await coffeeModels.getCoffees();
            if (!coffees) {
                return res.status(404).render("404", { message: "Aucun café trouvé", title: "Erreur 404" });// If no coffees found, render 404 page
            }
            res.render("catalog", { coffees, title: "Liste des cafés", cssFile: "catalog.css" });
        } catch (error) {
            next(error);
        }
    },

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
    }
}