# O’Coffee ☕️

Projet pédagogique réalisé dans le cadre de la formation **Développeur Web & Web Mobile** chez O’clock.  
Objectif : créer un site vitrine dynamique pour une boutique de café haut de gamme, basé sur **Node.js / Express / EJS** et connecté à une base de données **PostgreSQL**.

---

## 📖 Présentation

**oCoffee** est une boutique fictive située à *Hauts-de-Cloques*, imaginée par Jean et Jacques Pepper, deux passionnés de café.  
Le site a pour but de :

- Présenter la boutique et son ambiance.
- Mettre en valeur le savoir-faire des fondateurs.
- Proposer un catalogue de cafés (images, descriptions, caractéristiques, origine).
- Préparer une éventuelle évolution vers un futur e-commerce (mise en place d'un log administrateur pour la gestion des produits)

---

## 🧱 Stack technique

- **Node.js** / **Express**
- **EJS** (rendu côté serveur)
- **PostgreSQL**
- **Dotenv**
- **EmailJS**
- **Leaflet**
- **Multer**

Architecture : **MVC** avec séparation des responsabilités (routes, contrôleurs, modèles, vues).

---

## ⚙️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/TonySaes/Ocoffee_node.js_express.git
   cd Ocoffee_node.js_express
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l’environnement**
   ```bash
   cp .env.example .env
   ```
   Variables à renseigner dans `.env` :
   ```env
   PORT=3000
   DB_CONNECTION_STRING=postgres://user:password@host:5432/database
   ADMIN_USER=name
   ADMIN_PASSWORD=pwd
   ```

4. **Préparer la base de données**
   - Créer la base PostgreSQL.
   - Exécuter les scripts du dossier `data/`.

---

## ▶️ Lancer le projet

- **Développement** :
  ```bash
  npm run dev
  ```

---

## ✨ Fonctionnalités

### Attendus initaux
- Page d’accueil avec présentation de la boutique.
- Catalogue des cafés avec fiche détail par produit.
- Gestion des données depuis PostgreSQL.
- Rendu serveur avec EJS.

### Ajouts personnels
- Gestion de session avec authentification
- Integration de carte interactive 
- Formulaire de contact avec réponse mail automatique
- Gestion d'upload de fichier image (et suppression)

---

## 🎯 Objectifs pédagogiques 

### Hard skills
- Conception **MCD / MLD / MPD**
- Mise en place et connexion à une **base de données** PostgreSQL
- Développement d’une architecture **MVC**
- Développement de **composants d’accès aux données**

### Soft skills
- Organisation du temps de travail
- Utilisation des **issues GitHub** pour le suivi
- Recherche documentaire autonome

---

## 📌 Notes

- Projet réalisé en autonomie.
- Non destiné à la production commerciale.

---

Projet réalisé dans le cadre de ma formation DWWM avce l'école O'Clock
