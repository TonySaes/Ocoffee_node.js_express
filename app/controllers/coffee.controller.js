import coffeeModels from "../models/coffee.models.js";

export default {
    list: async (req, res, next) => {
        const coffees = await coffeeModels.getCoffees();
        if (!coffees) {
            return next();
        }
        res.render("catalog", { coffees, title: "Liste des cafés", cssFile: "catalog.css" });
    },

    detail: async (req, res, next) => {
        const coffee = await coffeeModels.getCoffeeByReference(req.params.reference);
        if (!coffee) {
            return next();
        }
        res.render("coffee", { coffee, title: coffee.name, cssFile: "coffee.css" });
    }
}