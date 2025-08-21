import coffeeModels from "../models/coffee.models.js";

export default {
    index : async (req, res) => {
        try {
            const coffees = await coffeeModels.getCoffeesNameForHome();
            res.render("home", {  title: "Accueil", cssFile: "home.css", coffees });
        } catch (error) {
            next(error);
        }
    }
}