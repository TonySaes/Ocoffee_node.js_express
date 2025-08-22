import express from "express";
import session from "express-session";
import "dotenv/config";

import homeRouter from "./app/routes/home.routes.js";
import shopRouter from "./app/routes/shop.routes.js";
import coffeeRouter from "./app/routes/coffee.routes.js";
import contactRouter from "./app/routes/contact.routes.js";
import adminRouter from "./app/routes/admin.routes.js";

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.session = req.session ;
    next();
});
app.get("/debug/session", (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    console.log(process.env.SESSION_SECRET);
    res.send(`Nombre de vues : ${req.session.views}`);
});

app.use("/", homeRouter);
app.use("/shop", shopRouter);
app.use("/coffees", coffeeRouter);
app.use("/contact", contactRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
    res.status(404).render("404", { message: "Page non trouvée", title: "Erreur 404", cssFile: "home.css" });
});
app.use((error, req, res, next) => {
    res.status(500).render("404", { message: error.message || "Erreur interne", title: "Erreur 500" });
});

app.listen(port, () => {
console.log(`Running on http://localhost:${port}`);
});