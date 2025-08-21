import express from "express";
import "dotenv/config";

import homeRouter from "./app/routes/home.routes.js";
import shopRouter from "./app/routes/shop.routes.js";
import coffeeRouter from "./app/routes/coffee.routes.js";
import contactRouter from "./app/routes/contact.routes.js";

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.use("/", homeRouter);
app.use("/shop", shopRouter);
app.use("/coffees", coffeeRouter);
app.use("/contact", contactRouter);

app.use((req, res) => {
    if(error) {
        console.error("❌ Erreur de connexion à la base :", error.message);
        return res.status(500).render("404", { message: error.message ||"Erreur de connexion à la base de données", title: "Erreur 500" });
    }
    res.status(404).render("404", { message: "Page non trouvée", title: "Erreur 404", cssFile: "home.css" });
});

app.listen(port, () => {
console.log(`Running on http://localhost:${port}`);
});