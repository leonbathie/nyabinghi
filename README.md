# 🌴 Campement Nyabinghi · Site Web

Site vitrine moderne, responsive et multilingue pour le **Campement Nyabinghi** à Abene, Casamance, Sénégal.

## ✨ Caractéristiques

- 🎨 **Design moderne** — Palette inspirée du Sénégal (terra, océan, sable)
- 📱 **100% responsive** — Mobile, tablette, desktop
- 🌍 **Multilingue** — Français · English · Español (détection automatique)
- ⚡ **Ultra rapide** — HTML/CSS/JS pur, aucun build requis
- 🎬 **Animations fluides** — Scroll AOS, slideshow hero, carousel témoignages
- 💬 **Bouton WhatsApp flottant** — Réservation en 1 clic
- 🖼️ **Galerie avec lightbox** — Photos plein écran
- 📝 **Formulaire intelligent** — Envoie directement vers WhatsApp pré-rempli
- 🗺️ **Carte intégrée** — Localisation Abene, Sénégal
- ♿ **Accessible** — Focus visible, reduced-motion, sémantique HTML5
- 🔍 **SEO optimisé** — Meta tags, Open Graph

## 🗂️ Structure des fichiers

```
campement/
├── index.html      # Page principale (toutes les sections)
├── styles.css      # Styles personnalisés + animations
├── i18n.js         # Traductions FR / EN / ES
├── script.js       # Interactivité (slideshow, carousel, lightbox, lang)
└── README.md       # Ce fichier
```

## 🚀 Lancement local

### Option 1 — Serveur Python (recommandé)
```powershell
python -m http.server 8080
```
Puis ouvrir : http://localhost:8080

### Option 2 — Serveur Node
```powershell
npx serve .
```

### Option 3 — Live Server (VS Code)
Clic droit sur `index.html` → **Open with Live Server**

## 📤 Déploiement

Le site est 100% statique. Il peut être déployé sur :
- **Netlify** — glisser-déposer le dossier sur https://app.netlify.com/drop
- **Vercel** — `vercel deploy` dans le dossier
- **GitHub Pages** — push sur la branche `main` puis activer Pages
- **Hébergement classique** — uploader via FTP

## 🎨 Personnalisation

### Changer les images
Toutes les images sont des liens Unsplash (libres d'usage). Pour utiliser tes propres photos :
1. Crée un dossier `images/` dans le projet
2. Remplace dans `index.html` chaque URL `https://images.unsplash.com/...` par `images/ton-photo.jpg`

### Modifier les couleurs
Dans `index.html` (entre les balises `<script>tailwind.config = {...}</script>`), ajuste les palettes `terra`, `ocean`, `sand`.

### Modifier les textes
Tous les textes sont dans **`i18n.js`**. Édite directement pour les 3 langues.

### Ajouter une langue
Dans `i18n.js`, duplique un bloc (ex: `en: { ... }`) et change la clé en `de`, `it`, etc.
Puis ajoute un bouton dans le menu langue de `index.html`.

## 📞 Contact

- **Téléphone** : +221 77 07 58 313 / +221 78 132 75 61
- **Email** : campementnyabinghisenegal@gmail.com
- **Adresse** : Rue Badala, Abene 27208, Sénégal
- **Instagram** : [@nyabinghi_campement_abene](https://www.instagram.com/nyabinghi_campement_abene/)

---

Fait avec ❤ pour la Casamance.
