import fs from "node:fs/promises";
import path from "node:path";

import belongModels from "../models/belong.models.js";
import coffeeModels from "../models/coffee.models.js";
import countryModels from "../models/country.models.js";
import tasteModels from "../models/taste.models.js";
import usersModels from "../models/users.models.js";

export default {
    async index(req, res, next) {
        const { okMessage } = req.query;
        const { errorMessage } = req.query;
        res.render("admin", { title: "Admin", cssFile: "admin.css", okMessage, errorMessage });
    },
    
    async createCoffee(req, res) {
        const file = req.file;
        const { name, description, price, reference, country, coffee_type } = req.body;
        
        // 1) Création des variables adaptées aux contraintes de la BDD
        const parsedPrice = Number(String(price).trim().replace(",", "."));
        let tasteIds = [];
        if (Array.isArray(coffee_type)) {
            tasteIds = coffee_type.map(Number);
        } else if (coffee_type != null) { 
            tasteIds = [Number(coffee_type)];
        }

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
        
        try {
        // 3) Récupération / création du pays
            let countryId = await countryModels.getCountryIdByName(country);
            if (!countryId) {
                countryId = await countryModels.createCountry(country);
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
            await usersModels.createUser({ username, password, is_admin });
            const okMessage = encodeURIComponent(`Utilisateur "${username}" créé avec succès !`);
            res.redirect(`/admin/manageUsers?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création de l'utilisateur : " + (error.detail || error.message));
            res.redirect(`/admin/createUser?errorMessage=${errorMessage}`);
        }
    }, 
    
    async createTaste(req, res) {
        const typeInput = String(req.body.type).trim();

        const errors = [];
        if (!String(typeInput || "").trim()) errors.push("Le nom est requis.");
        if (errors.length) {
            const errorMessage = encodeURIComponent(errors.join(" "));
            return res.redirect(`/admin/createTaste?errorMessage=${errorMessage}`);
        }

        try {
            const typeToCheck = await tasteModels.getTasteByName(typeInput);
            if (typeToCheck) {
                const errorMessage = encodeURIComponent(`Le type de café "${typeInput}" existe déjà.`);
                return res.redirect(`/admin/createTaste?errorMessage=${errorMessage}`);
            }

            await tasteModels.createTaste(typeInput);
            const okMessage = encodeURIComponent(`Type de café "${typeInput}" créé avec succès !`);
            res.redirect(`/admin?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la création du type de café : " + (error.detail || error.message));
            res.redirect(`/admin/createTaste?errorMessage=${errorMessage}`);
        }
    },
    async deleteCoffee(req, res) {
        const id = Number(req.params.id);

        try {
            const coffee = await coffeeModels.getCoffeeById(id);
            const reference = coffee.reference;
            if (!coffee) {
                const errorMessage = encodeURIComponent("Café non trouvé.");
                return res.redirect(`/coffees?errorMessage=${errorMessage}`);
            }

            const imgPath = path.resolve(process.cwd(), "public", "images", "coffees", `${reference}.jpg`);
            try {
                await fs.unlink(imgPath);
            } catch {}

            await belongModels.deleteBelongsByCoffeeId(id);
            await coffeeModels.deleteCoffee(id);
            const okMessage = encodeURIComponent(`Café supprimé avec succès !`);
            res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la suppression du café : " + (error.detail || error.message));
            res.redirect(`/coffees?errorMessage=${errorMessage}`);
        }
    },

    async deleteUser(req, res) {
        const id = Number(req.params.id);

        try {
            const user = await usersModels.getUserById(id);
            if (!user) {
                const errorMessage = encodeURIComponent("Utilisateur non trouvé.");
                return res.redirect(`/admin/manageUsers?errorMessage=${errorMessage}`);
            }

            await usersModels.deleteUser(id);
            const okMessage = encodeURIComponent(`Utilisateur "${user.username}" supprimé avec succès !`);
            res.redirect(`/admin/manageUsers?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la suppression de l'utilisateur : " + (error.detail || error.message));
            res.redirect(`/admin/manageUsers?errorMessage=${errorMessage}`);
        }
    },

    async editCoffee(req, res) {
        const id = Number(req.params.id);
        const { name, price, country, description, coffee_type } = req.body;
        const parsedPrice = Number(String(price).trim().replace(",", "."));

        let newTasteIds = [];
        if (Array.isArray(coffee_type)) {
            newTasteIds = coffee_type.map(Number);
        } else if (coffee_type != null) { // couvre undefined et null
            newTasteIds = [Number(coffee_type)];
        }

        const errors = [];
        if (!String(name || "").trim()) errors.push("Le nom est requis.");
        if (!String(description || "").trim()) errors.push("La description est requise.");
        if (!Number.isFinite(parsedPrice)) errors.push("Le prix doit être un nombre.");
        if (!String(country || "").trim()) errors.push("Le pays est requis.");
        if (!newTasteIds.length) errors.push("Sélectionnez au moins une caractéristique.");
        if (errors.length) {
            const errorMessage = encodeURIComponent(errors.join(" "));
            return res.redirect(`/admin?errorMessage=${errorMessage}`);
        }

        try {
            let country_id = await countryModels.getCountryIdByName(country);
            if (!country_id) {
                country_id = await countryModels.createCountry(country);
            }

            const coffeeData = {
                name: String(name),
                price: parsedPrice,
                country_id: Number(country_id),
                description: String(description)
            };

            const addedCoffee = await coffeeModels.updateCoffee(id, coffeeData);
            const oldTasteIds = await belongModels.getTasteIdsByCoffeeId(id);

            const oldSet = new Set(oldTasteIds);
            const newSet = new Set(newTasteIds);
            const toAdd = newTasteIds.filter(id => !oldSet.has(id));
            const toRemove = oldTasteIds.filter(id => !newSet.has(id));
            for (const id of toAdd) {
                await belongModels.createBelong(addedCoffee.coffee_id, id);
            }
            for (const id of toRemove) {
                await belongModels.deleteBelong(addedCoffee.coffee_id, id);
            }

            const okMessage = encodeURIComponent(`Café "${name}" modifié avec succès !`);
            res.redirect(`/coffees?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la modification du café : " + (error.detail || error.message));
            res.redirect(`/admin/editCoffee/${id}?errorMessage=${errorMessage}`);
        }
    }, 
    
    async editUser(req, res) {
        const id = req.params.id;
        const { username, password, is_admin } = req.body;

        const errors = [];
        if (!username) errors.push("Le nom d'utilisateur est requis.");
        if (!password) errors.push("Le mot de passe est requis.");
        if (errors.length) {
            const errorMessage = encodeURIComponent(errors.join(" "));
            return res.redirect(`/admin/editUser/${id}?errorMessage=${errorMessage}`);
        }

        try {
            await usersModels.updateUser(id, { username, password, is_admin });
            const okMessage = encodeURIComponent(`Utilisateur "${username}" modifié avec succès !`);
            res.redirect(`/admin/manageUsers?okMessage=${okMessage}`);
        } catch (error) {
            const errorMessage = encodeURIComponent("Une erreur est survenue lors de la modification de l'utilisateur : " + (error.detail || error.message));
            res.redirect(`/admin/editUser/${id}?errorMessage=${errorMessage}`);
        }
    },
    
    async handleLogin(req, res, next) {
        const { username, password } = req.body;

        const okUser = String(username).trim();
        const okPass = String(password);
        if (!okUser || !okPass) {
            const errorMessage = encodeURIComponent("Identifiants invalides.");
            return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
        }

        try {
            const user = await usersModels.getUserByName(okUser);
            if (!user || user.password !== okPass) {
                const errorMessage = encodeURIComponent("Identifiants invalides.");
                return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
            };
            
            req.session.regenerate((error) => {
                if (error) {
                    const errorMessage = encodeURIComponent("Une erreur est survenue lors de la connexion.");
                    return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
                }
                req.session.user = { id: user.id, username: user.username, isAdmin: user.is_admin };
                req.session.isAdmin = user.is_admin;
                req.session.save();
                const okMessage = encodeURIComponent("Connexion réussie.");
                res.redirect(`/admin?okMessage=${okMessage}`);
            });
        } catch (error) {
            next(error);
        }
    },

    handleLogout(req, res) {
        req.session.destroy(() => {
            res.clearCookie("sessionId");
            res.redirect("/");
        });
    },

    async listUsers(req, res, next) {
        const { okMessage } = req.query;
        const { errorMessage } = req.query;

        try {
            const users = await usersModels.getAllUsers();
            if (!users) {
                const errorMessage = encodeURIComponent("Aucun utilisateur trouvé.");
                return res.redirect(`/admin?errorMessage=${errorMessage}`);
            }

            res.render("manageUsers", { title: "Gestion des utilisateurs", users, cssFile: "users.css", okMessage, errorMessage});
        } catch (error) {
            next(error);
        }
    },
    
    async showCreateCoffee(req, res, next) {
        const { errorMessage } = req.query;

        try {
            const coffeeTypes = await tasteModels.getAllTypes();
            if (!coffeeTypes) {
                return res.status(404).render("404", { message: "Aucun type de café trouvé", title: "Erreur 404" });
            }

            res.render("createCoffee", { title: "Créer un article", cssFile: "form.css", errorMessage, coffeeTypes });
        } catch (error) {
            next(error)
        }
    },

    async showCreateTaste(req, res) {
        const { errorMessage } = req.query;
        res.render("createTaste", { title: "Créer un type de café", cssFile: "form.css", errorMessage });
    },
    
    async showCreateUser(req, res) {
        const { errorMessage } = req.query;
        res.render("createUser", { title: "Créer un utilisateur", cssFile: "form.css", errorMessage });
    },

    async showEditCoffee(req, res, next) {
        const id = req.params.id;
        const { errorMessage } = req.query;

        try {
            const coffee = await coffeeModels.getCoffeeById(id);
            const coffeeTypes = await tasteModels.getAllTypes();
            const selectedTypes = await belongModels.getTasteIdsByCoffeeId(id);
            if (!coffee) {
                const errorMessage = encodeURIComponent("Café non trouvé.");
                return res.redirect(`/admin/editCoffee/${id}?errorMessage=${errorMessage}`);
            }

            res.render("editCoffee", { title: `Éditer ${coffee.name}`, cssFile: "form.css", coffee, coffeeTypes, selectedTypes, errorMessage });
        } catch (error) {
            next(error);
        }
    },

    async showEditUser(req, res, next) {
        const id = req.params.id;
        const { errorMessage } = req.query;

        try {
            const user = await usersModels.getUserById(id);
            if (!user) {
                const errorMessage = encodeURIComponent("Utilisateur non trouvé.");
                return res.redirect(`/admin/editUser/${id}?errorMessage=${errorMessage}`);
            }

            res.render("editUser", { title: `Éditer ${user.username}`, cssFile: "form.css", user, errorMessage });
        } catch (error) {
            next(error);
        }
    },

    showLogin(req, res) {
        const errorMessage = req.query.errorMessage;
        res.render("login", { title: "Connexion", cssFile: "form.css", errorMessage });
    },



}