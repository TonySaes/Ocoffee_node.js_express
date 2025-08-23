import coffeeModels from "../models/coffee.models.js";

export default {
    index : async (req, res, next) => {
        try {
            const coffees = await coffeeModels.getCoffees();
            if (!coffees) {
                return res.status(404).render("404", { message: "Aucun café trouvé", title: "Erreur 404" });
            }
            
            res.render("home", {  title: "Accueil", cssFile: "home.css", coffees });
        } catch (error) {
            next(error);
        }
    }
}