import fs from "node:fs/promises";
import tasteModel from "../models/taste.models.js";
import countryModel from "../models/country.models.js";
import coffeeModels from "../models/coffee.models.js";
import belongModels from "../models/belong.models.js";
import usersModels from "../models/users.models.js";

export default {
    async index(req, res, next) {
        const { okMessage } = req.query;
        const { errorMessage } = req.query;
        res.render("admin", { title: "Admin", cssFile: "admin.css", okMessage, errorMessage });
    },

    async showCreateCoffee(req, res, next) {
        try {
            const { errorMessage } = req.query;
            const coffeeTypes = await tasteModel.getAllTypes();
            if (!coffeeTypes) {
                return res.status(404).render("404", { message: "Aucun type de café trouvé", title: "Erreur 404" });
            }
            res.render("createCoffee", { title: "Créer un article", cssFile: "createCoffee.css", errorMessage, coffeeTypes });
        } catch (error) {
            next(error)
        }
    },
    
    async createCoffee(req, res) {
        const file = req.file;

        try {
            const { name, description, price, reference, country, coffee_type } = req.body;

            // 1) Création des variables adaptées aux contraintes de la BDD
            const parsedPrice = Number(String(price).trim().replace(",", "."));
            let tasteIds = [];
            if (Array.isArray(coffee_type)) {
                tasteIds = coffee_type.map(Number);
            } else if (coffee_type != null) { // couvre undefined et null
                tasteIds = [Number(coffee_type)];
            };
            // 2) Validations basiques
            const errors = [];
            if (!String(name || "").trim()) errors.push("Le nom est requis.");
            if (!String(description || "").trim()) errors.push("La description est requise.");
            if (!Number.isFinite(parsedPrice)) errors.push("Le prix doit être un nombre.");
            if (!String(reference || "").trim()) errors.push("La référence est requise.");
            if (!String(country || "").trim()) errors.push("Le pays est requis.");
            if (!tasteIds.length) errors.push("Sélectionnez au moins une caractéristique.");

            if (errors.length) {
                if (file?.path) { try { await fs.unlink(file.path); } catch {} }
                const errorMessage = encodeURIComponent(errors.join(" "));
                return res.redirect(`/admin?errorMessage=${errorMessage}`);
            };

            // 3) Récupération / création du pays
            let countryId = await countryModel.getCountryIdByName(country);
            if (!countryId) {
                countryId = await countryModel.createCountry(country);
            }

            // 4) Données café
            const coffeeData = {
                name: String(name),
                description: String(description),
                price: parsedPrice,
                reference: String(reference).trim(),
                country_id: Number(countryId),
            };

            // 5) Insertion café
            const coffeeId = await coffeeModels.createCoffee(coffeeData);

            // 6) Liaisons belong (une requête paramétrée par ID, simple & lisible)
            for (const tid of tasteIds) {
                await belongModels.createBelong(coffeeId, tid);
            }
            const okMessage = encodeURIComponent(`Café "${coffeeData.name}" créé avec succès !`);
            return res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            if (file?.path) { try { await fs.unlink(file.path); } catch {} };
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création du café : " + (error.detail || error.message));
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
    },

    showLogin(req, res) {
        const errorMessage = req.query.errorMessage;
        res.render("login", { title: "Connexion", cssFile: "login.css", errorMessage });
    },

    handleLogin(req, res) {
        const { username, password } = req.body;
        const okUser = username === process.env.ADMIN_USER;
        const okPass = password === process.env.ADMIN_PASSWORD;
        if (!okUser || !okPass) {
            const errorMessage = encodeURIComponent("Identifiants invalides.");
            return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
        }
        req.session.regenerate((error) => {
            if (error) {
                const errorMessage = encodeURIComponent("Une erreur est survenue lors de la connexion.");
                return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
            }
            req.session.isAdmin = true;
            req.session.username = username;
            req.session.save();
            const okMessage = encodeURIComponent("Connexion réussie.");
            res.redirect(`/admin?okMessage=${okMessage}`);
        });
    },

    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie("sessionId");
            res.redirect("/");
        });
    },

    async listUsers(req, res) {
        try {
            const { okMessage } = req.query;
            const users = await usersModels.getAllUsers();
            if (!users) {
                const errorMessage = encodeURIComponent("Aucun utilisateur trouvé.");
                return res.redirect(`/admin?errorMessage=${errorMessage}`);
            }
            res.render("manageUsers", { title: "Gestion des utilisateurs", users, cssFile: "admin.css", okMessage });
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la récupération des utilisateurs : " + (error.detail || error.message));
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }
    },

    async showCreateUser(req, res) {
        const { errorMessage } = req.query;
        res.render("createUser", { title: "Créer un utilisateur", cssFile: "createUser.css", errorMessage });
    },

    async createUser(req, res) {
        const { username, password, is_admin } = req.body;
        const errors = [];
        if (!username) errors.push("Le nom d'utilisateur est requis.");
        if (!password) errors.push("Le mot de passe est requis.");
        if (errors.length) {
            const errorMessage = encodeURIComponent(errors.join(" "));
            return res.redirect(`/admin/createUser?errorMessage=${errorMessage}`);
        }
        try {
            const userId = await usersModels.createUser({ username, password, is_admin });
            const okMessage = encodeURIComponent(`Utilisateur "${username}" créé avec succès !`);
            res.redirect(`/admin/manageUsers?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création de l'utilisateur : " + (error.detail || error.message));
            res.redirect(`/admin/createUser?errorMessage=${errorMessage}`);
        }
    }
};