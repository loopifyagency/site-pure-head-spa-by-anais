---
name: PURE HEAD SPA by Anaïs
description: Une cabine de soin que l'on traverse, lumière tamisée, laiton, lin et jute.
colors:
  creme: "#F4EBDD"
  blanc: "#FFFFFF"
  lin: "#E9DCC6"
  noyer: "#35261B"
  raphia: "#6A4F36"
  laiton: "#A87B3C"
  laiton-text: "#8E6422"
  laiton-ink: "#75501C"
  braise: "#E0B073"
  statut-ouvert: "#5E8C4A"
typography:
  display-hero:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(7rem, min(24vw, 38svh), 28rem)"
    fontWeight: 500
    lineHeight: 0.8
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.7rem, 7.4vw, 7.4rem)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2.3rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  pill: "999px"
  arch: "999px 999px 0 0"
  card: "14px"
  tile: "6px"
  focus: "4px"
spacing:
  gutter: "clamp(1.1rem, 3.4vw, 3rem)"
  section: "clamp(5.5rem, 13vw, 12rem)"
components:
  button-primary:
    backgroundColor: "{colors.noyer}"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
    padding: "1.15rem 2.1rem"
  button-primary-hover:
    backgroundColor: "{colors.laiton-text}"
    textColor: "{colors.blanc}"
  button-light:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.noyer}"
    rounded: "{rounded.pill}"
    padding: "1.15rem 2.1rem"
  button-light-hover:
    backgroundColor: "{colors.braise}"
    textColor: "{colors.noyer}"
  review-card:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.noyer}"
    rounded: "{rounded.card}"
    padding: "2.6rem"
---

# Design System: PURE HEAD SPA by Anaïs

## Overview

**Creative North Star: "La cabine tamisée"**

Le site est la cabine de soin que l'on traverse. On entre dans une lumière crème, on s'allonge, la pièce s'assombrit autour de la chaleur et des mains, puis la lumière revient avec le brushing. Tout le décor vient du lieu : le laiton du halo de lavage, le soleil de raphia, le tapis de jute, le bois du mur, le lin. L'italique de Bodoni Moda reprend la calligraphie du logo doré.

Le ton est celui d'un accueil, pas d'une vitrine : grandes respirations, gestes lents, aucune agitation. Le mouvement est une matière de la page (rideaux, arches qui s'ouvrent, éventail qui se dessine), jamais un effet décoratif posé sur un gabarit.

**Key Characteristics:**
- Beige crème et blanc pur en fonds, noyer en nuit de cabine, laiton en fil d'or.
- Un fil rouge unique : l'arche à fils de laiton (cadre des photos, éventail dessiné, séparateurs).
- Titres géants en Bodoni Moda, texte en Jost, capitales espacées pour les repères.
- Chaque section a sa propre mise en scène : aucune n'en répète une autre.
- Photos petites et douces, donc cadrées en arches de taille modeste, avec grain et étalonnage chaud.

## Colors

Une palette chaude à deux régimes : le jour (crème, blanc, lin) et la nuit de cabine (noyer, braise).

### Primary
- **Laiton du halo** (#A87B3C) : le fil d'or. Éventail, icônes, tresse, barre de progression, soulignements. Jamais en texte courant, son contraste sur blanc est de 3,8:1.
- **Laiton de lecture** (#8E6422) : le laiton quand il porte du texte ou un fond de bouton (chiffres géants, guillemets, survol des boutons).
- **Laiton profond** (#75501C) : mots en italique dans les titres sur fond clair, état actif des horaires.

### Secondary
- **Braise** (#E0B073) : la lumière sur fond noyer. Italiques des titres sombres, éventail du bloc d'appel, ligne du jour.

### Neutral
- **Beige crème** (#F4EBDD) : fond principal du site, texte sur noyer. Imposé par la marque.
- **Blanc pur** (#FFFFFF) : sections de respiration (chiffres, accès), cartes d'avis, boutons clairs. Imposé par la marque.
- **Lin sable** (#E9DCC6) : bandes secondaires (rail horizontal, avis), fond d'attente des cadres photo.
- **Noyer** (#35261B) : texte, nuit de cabine (rituel, appel, pied de page), bouton principal.
- **Raphia** (#6A4F36) : texte secondaire sur fond clair (plus de 6:1 sur le crème).

### Status
- **Vert d'ouverture** (#5E8C4A) : le seul vert du site, un point de 8px qui pulse quand le salon est ouvert (heure de Paris). Jamais ailleurs.

### Named Rules
**La règle du fil d'or.** Le laiton trace, il ne parle pas : pas de texte courant en #A87B3C.
**La règle de la nuit.** Le noyer n'occupe que les moments d'intimité (rituel, appel, pied). Le reste de la page reste crème et blanc.

## Typography

**Display Font:** Bodoni Moda (avec Didot, Georgia)
**Body Font:** Jost (avec Futura, system-ui)

**Character:** un didone à fort contraste dont l'italique rappelle le script du logo, face à un géométrique net dont les capitales espacées répondent au « HEAD SPA » de l'enseigne.

### Hierarchy
- **Display hero** (500 italique, clamp(7rem, min(24vw, 38svh), 28rem), 0.8) : le mot « Pure », une fois par page.
- **Headline** (500, clamp(2.7rem, 7.4vw, 7.4rem), 0.96) : titres de section, avec un mot ou groupe de mots en italique laiton.
- **Title** (500, clamp(1.4rem, 2.5vw, 2.3rem), 1.15) : questions de la FAQ, noms des avis en italique.
- **Body** (400, 1.0625rem, 1.65) : texte courant, 38 à 54ch.
- **Label** (500, 0.74rem, 0.2em, capitales) : navigation, horaires, légendes.

**Échelle contextuelle.** Les titres de section ne partagent pas une seule taille : le rituel épinglé (2 à 3,6rem), le rail (3 à 7rem), la FAQ (2,5 à 6rem) et l'accès (3 à 7rem) réduisent le Headline pour tenir dans leur mise en scène. Le texte courant varie de 0,92rem (écrans courts) à 1,18rem (rituel). Ces variantes sont fluides (`clamp()`), toujours bornées, et se déduisent du Headline ou du Body.

### Named Rules
**La règle de la calligraphie.** L'italique de Bodoni est réservé au mot que le logo écrirait en script : « Pure », les noms d'actes, un mot-clé de titre. Pas de paragraphe en italique.
**La règle des 11 pixels.** Aucun texte fonctionnel sous 0,7rem.

## Layout

Une seule colonne de scène, des marges latérales fluides (`--gut`) et un rythme vertical `--sec` plus grand au-dessus des titres qu'en dessous. Les compositions sont asymétriques : texte à gauche, arche à droite, colonnes de galerie décalées, sections qui s'épinglent. À partir de 900px de large et 540px de haut, le rituel et le rail horizontal s'épinglent. En dessous, ils redeviennent un flux normal (rituel empilé, rail en défilement natif avec accroche).

## Elevation & Depth

La profondeur vient de la lumière et du recouvrement, pas de la bordure. Les photos, tuiles et cartes portent une ombre longue, douce et décalée vers le bas, comme posée sur un sol. Rien n'a de ligne de contour en plus de l'ombre.

### Shadow Vocabulary
- **Arche photo** (`box-shadow: 0 40px 60px -36px rgba(53, 38, 27, .6)`) : arche du hero.
- **Tuile et carte** (`box-shadow: 0 30px 50px -34px rgba(53, 38, 27, .5)`) : galerie, avis, photos flottantes.
- **Appel flottant** (`box-shadow: 0 18px 30px -14px rgba(53, 38, 27, .7)`) : bouton « Appeler » mobile.

### Named Rules
**La règle du sol.** Toute ombre a un décalage vertical et un rayon négatif : elle tombe, elle ne rayonne pas.

## Shapes

L'arche (`border-radius: 999px 999px 0 0`) est la forme signature : cadre des photos, bord supérieur du bloc d'appel (la FAQ s'achève en arche noyer), arche de la section des chiffres. Les boutons sont des pilules. Les cartes d'avis ont 14px de rayon, les tuiles 6px, l'anneau de focus 4px. Les séparateurs sont dessinés : bande inclinée de -2,2°, diagonale du rail, tresse de jute en deux sinusoïdes en opposition de phase, éventail à fils.

## Components

### Buttons
- **Shape:** pilule (999px), capitales Jost 500 espacées de 0,2em.
- **Primary:** fond noyer, texte crème, remplissage laiton de lecture qui monte en arche au survol, texte blanc ; le numéro de téléphone peut suivre après un filet vertical.
- **Light:** fond blanc, texte noyer, remplissage braise ; pour les fonds sombres.
- **Ghost:** contour crème 1px, remplissage crème au survol.
- **Magnétisme:** sur pointeur fin, le bouton suit légèrement le curseur (28% horizontal, 38% vertical).

### Navigation
Logo en italique « Pure » avec « HEAD SPA » en capitales, liens centrés soulignés par un trait qui se dessine, bouton de rendez-vous à droite. Se cache en descendant, revient en remontant. Sur mobile, un rond noyer ouvre un menu plein écran qui s'ouvre en cercle depuis le coin, avec liens en italique géant.

### Cards / Containers
- **Avis:** fond blanc, 14px, guillemet laiton en tête, nom en italique laiton profond précédé d'un filet. Texte repris tel quel, sans retouche.
- **Tuile de galerie:** 6px ou arche, légende en pilule blanche qui monte au survol, reflet lumineux qui suit la souris, inclinaison 3D de 11° maximum.

### Cadre arche
Toute photo est dans une arche ou dans un cercle, jamais dans un rectangle plein écran : les photos sources sont petites, et l'arche les valorise à taille modeste.

### Éventail à fils (signature)
Demi-cercle de 21 rayons de longueurs alternées avec un moyeu et un socle, dessiné en SVG par le script. Se dessine au chargement, au hero et à l'appel à l'action.

## Do's and Don'ts

### Do:
- **Do** garder le crème et le blanc pur dominants ; le noyer est un moment, pas un thème.
- **Do** dessiner les séparateurs et les icônes en un seul trait laiton de 1,5 à 1,6px, extrémités rondes.
- **Do** animer avec `expo.out` pour les entrées et `expo.inOut` pour les rideaux ; garder du texte lisible à l'arrêt de chaque animation.
- **Do** proposer une version statique complète sous `prefers-reduced-motion`.
- **Do** tenir « Appeler » à un geste, à toute hauteur de page.

### Don't:
- **Don't** utiliser le laiton #A87B3C pour du texte courant.
- **Don't** agrandir les photos sources au-delà de leur cadre en arche : elles sont très petites.
- **Don't** inventer de prix, de chiffres ou d'avis ; les avis se reprennent mot pour mot.
- **Don't** poser de kicker au-dessus d'un titre ni de numérotation de sections.
- **Don't** répéter une mise en scène d'une section à l'autre.
