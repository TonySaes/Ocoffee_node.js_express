import coffeeModels from "../models/coffee.models.js";

export default {
    index : async (req, res) => {
        const coffees = await coffeeModels.getCoffeesNameForHome();
        res.render("home", {  title: "Accueil", cssFile: "home.css", coffees });
    }
}