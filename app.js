import express from "express";
import session from "express-session";
import "dotenv/config";

import adminFirstCheck from "./app/modules/createAdminForFirstLogin.js";

import adminRouter from "./app/routes/admin.routes.js";
import coffeeRouter from "./app/routes/coffee.routes.js";
import contactRouter from "./app/routes/contact.routes.js";
import homeRouter from "./app/routes/home.routes.js";
import shopRouter from "./app/routes/shop.routes.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);

if (process.env.NODE_ENV !== "test") {
  await adminFirstCheck();
}

app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});

app.use("/", homeRouter);
app.use("/shop", shopRouter);
app.use("/coffees", coffeeRouter);
app.use("/contact", contactRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
  console.error(`404 - Page non trouvée : ${req.originalUrl}`);
  res
    .status(404)
    .render("404", { message: "Page non trouvée", title: "Erreur 404", cssFile: "home.css" });
});

app.use((error, req, res, next) => {
  console.error(`500 - Erreur interne : ${error.message}`);
  res
    .status(500)
    .render("404", { message: error.message || "Erreur interne", title: "Erreur 500", cssFile: "home.css" });
});

export default app;
