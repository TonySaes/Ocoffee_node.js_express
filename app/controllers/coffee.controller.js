import coffeeModels from "../models/coffee.models.js";

export default {
    list: async (req, res, next) => {
        const coffees = await coffeeModels.getCoffees();
        if (!coffees) {
            return next();
        }
        res.render("catalog", { coffees, title: "Liste des cafés", cssFile: "catalog.css" });
    }
}