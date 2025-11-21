# O'Coffee — Jeu d’essai manuel fonctionnel 

## 1. Authentification / Sessions

| Test | Action | Données envoyées | Résultat attendu | Résultat obtenu |
|------|--------|------------------|------------------|------------------|
| Connexion valide | POST /login | username=valide, password=valide | Session créée, redirection admin | Conforme |
| Connexion invalide | POST /login | mauvais mot de passe | Erreur + retour login | Conforme |
| Accès admin sans session | GET /admin | — | Redirection vers /login | Conforme |
| Déconnexion | POST /logout | — | Session détruite | Conforme |

## 2. CRUD Produits (Admin)

| Test | Action | Données | Résultat attendu | Résultat obtenu |
|------|--------|---------|------------------|------------------|
| Créer un café | POST /admin/coffees | nom, origine, prix | Café créé | Conforme |
| Modifier un café | POST/PATCH /admin/editCoffee/:id | champs modifiés | Café mis à jour | Conforme |
| Supprimer un café | POST/DELETE /admin/coffees/:id/delete | — | Café supprimé | Conforme |


## 3. Formulaire de contact

| Test | Action | Données | Résultat attendu | Résultat obtenu |
|------|--------|---------|------------------|------------------|
| Message valide | POST /contact | name, email, message | Email envoyé | Conforme |
| Email invalide | POST /contact | email incorrect | Erreur | Conforme |
| Champs manquants | POST /contact | — | Validation → erreur | Conforme |

## 4. Upload d’images (Multer)

| Test | Action | Données | Résultat attendu | Résultat obtenu |
|------|--------|---------|------------------|------------------|
| Upload JPG | POST /admin/createCoffee | image.jpg | Accepté | Conforme |
| Upload PNG | POST /admin/createCoffee | image.png | Accepté | Conforme |
| Upload PDF | POST /admin/createCoffee | fichier.pdf | Rejeté | Conforme |

## 6. Sécurité / Accès protégés

| Test | Action | Résultat attendu | Résultat obtenu |
|------|--------|------------------|------------------|
| Accès admin sans session | GET /admin | Refus | Conforme, redirection login |
| Accès direct URL protégée | GET /admin/... | Refus | Conforme, redirection login |

