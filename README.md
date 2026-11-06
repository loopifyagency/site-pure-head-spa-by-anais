# PURE HEAD SPA by Anaïs

Site vitrine one-page du centre de bien-être **PURE HEAD SPA by Anaïs** (420 rue Jurien de la Gravière, 29200 Brest).
Action principale : **prendre rendez-vous** par téléphone ou SMS (06 32 88 86 11).

## Lancer le site

Aucune étape de build : ce sont des fichiers statiques. Depuis la racine du dépôt :

```bash
python3 -m http.server 8765
```

Puis ouvrir http://localhost:8765.

## Déploiement

Publier uniquement `index.html`, `favicon.svg` et le dossier `assets/` sur un hébergement statique (GitHub Pages, Netlify, OVH…). Les autres fichiers (`PRODUCT.md`, `DESIGN.md`, `.impeccable/`, `.claude/`) sont des notes de travail et n'ont pas à être en ligne.

## Structure

| Chemin | Rôle |
|---|---|
| `index.html` | Contenu, SEO, données structurées `DaySpa` (adresse, téléphone, horaires) |
| `assets/css/main.css` | Design system : tokens en tête de fichier, une section de style par partie de la page |
| `assets/js/main.js` | Mouvement : loader, Lenis, GSAP + ScrollTrigger, statut ouvert/fermé |
| `assets/vendor/` | GSAP 3.15, ScrollTrigger, Lenis 1.3 (copiés localement, pas de CDN) |
| `assets/fonts/` | Bodoni Moda et Jost, auto-hébergées |
| `assets/img/` | Photos du salon (agrandies et étalonnées) et texture de lin |
| `PRODUCT.md`, `DESIGN.md` | Contexte produit et système visuel |

## Modifier les informations

- **Téléphone** : chercher `+33632888611` et `06 32 88 86 11` dans `index.html`.
- **Horaires** : tableau `.hours` dans `index.html`, objet `SCHEDULE` en haut de `assets/js/main.js`, et `openingHoursSpecification` dans le JSON-LD.
- **Avis** : section `#avis` de `index.html`. Les avis sont reproduits mot pour mot, ne pas les corriger.

## Accessibilité et performance

- Respecte `prefers-reduced-motion` : version statique complète, sans loader ni sections épinglées.
- Navigation clavier, lien d'évitement, textes alternatifs, contrastes vérifiés.
- Sur mobile, le rituel s'empile et le rail devient un défilement horizontal natif.
- Poids total de la page : environ 1 Mo, images en chargement différé.
