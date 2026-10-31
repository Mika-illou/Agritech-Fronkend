# Agritech App - Projet Agricole
Un site web complet pour la gestion agricole, offrant des fonctionnalités de formations, météo, indicateurs et espace membre.


## Aperçu

    Agritech App est une application web complète destinée aux agriculteurs, offrant :
    Des formations agricoles pratiques
    Des informations météorologiques locales
    Des indicateurs agricoles (FAO)
    Un espace membre sécurisé
    Un système de commentaires et d'interaction

## Fonctionnalités

    Authentification utilisateur avec page de login
    Menu responsive avec sidebar sur mobile
    Galeries de formations avec images et dates
    Pages de détail pour chaque formation
    Système de commentaires avec formulaire d'ajout
    Barre de recherche fonctionnelle
    Design responsive adapté mobile/tablette/desktop
    Intégration des médias sociaux
    Newsletter avec formulaire d'inscription
    Navigation complète entre toutes les pages

## Fichiers
1. index.html - Page de Connexion
Interface de login avec validation
Design moderne avec carte de connexion
Lien vers la page d'accueil après authentification

2. home.html - Page d'Accueil (à créer)
Tableau de bord principal
Affichage des indicateurs clés
Accès rapide aux différentes sections

3. formation.html - Page des Formations
Galerie de 10 formations agricoles
Filtrage par catégories
Dates et auteurs pour chaque formation
Boutons "Voir plus" redirigeant vers les détails

4. lien_voir_detail.html - Détail d'une Formation
Présentation complète d'une formation
Profil de l'auteur avec photo et réseaux sociaux
Section commentaires avec 7 commentaires d'exemple
Formulaire d'ajout de commentaire

## Installation et Utilisation
    Télécharger les fichiers

    git clone [url-du-projet]
    Ouvrir dans un navigateur

    Ouvrir index.html directement dans votre navigateur
    Aucun serveur backend requis pour la version frontend
    Navigation de test

## Technologies Utilisées

    HTML5 - Structure sémantique
    CSS3 - Styles et animations
    Bootstrap 5.3 - Framework CSS responsive
    Bootstrap Icons - Icônes vectorielles
    Font Awesome - Icônes supplémentaires

## Pages du Site
### Page de Connexion (index.html)
    Formulaire d'authentification

    Validation des champs email/mot de passe

    Option "Se souvenir de moi"

    Lien de récupération de mot de passe

### Page d'Accueil (home.html - à implémenter)
    Header avec navigation principale

    Section bannière avec image

    Cartes pour : Indicateurs FAO, Météo Local, Formations Pratiques

    Footer avec newsletter et contacts

### Page Formations (formation.html)
    Grille responsive de formations

    10 cartes avec images, dates, catégories

    Pagination implicite par scroll

    Boutons d'accès aux détails

### Page Détail Formation (lien_voir_detail.html)
    Article complet avec contenu détaillé

    Section auteur avec profil

    Liste des commentaires avec dates

    Formulaire d'ajout de commentaire

## Responsive Design
    Le site est entièrement responsive avec :

    Mobile : Menu hamburger, disposition verticale

    Tablette : Grilles adaptatives, taille de texte ajustée

    Desktop : Layout complet, navigation horizontale


## Gestion de la connexion, des blogs et des commentaires (localStorage)

Nouveaux fichiers JavaScript :
    app.js - base localStorage, comptes, session, navbar (à inclure sur toutes les pages)
    formation.js - liste des blogs, ajout, édition, suppression
    detail.js - détail d'un blog (lien_voir_detail.html?id=...) et commentaires

Comptes de test (section Our Teams de home.html) :
    Malika Malikattou - malika@agritech.com / malika123
    Leila Leilatou - leila@agritech.com / leila123
    Amir Amirou - amir@agritech.com / amir123
    Abdou Abdourahmane - abdou@agritech.com / abdou123

Pour réinitialiser les données : vider le localStorage du navigateur (F12 > Application).
